from django.utils import timezone
from fango.models import AppUser, Language, Word, Translation, UserHistory, Quiz, QuizWord
from django.core.exceptions import ValidationError

# NOTE: This script is meant to seed a new database.
# NOTE: This clears ALL existing data
QuizWord.objects.all().delete()
Quiz.objects.all().delete()
UserHistory.objects.all().delete()
Translation.objects.all().delete()
Word.objects.all().delete()
Language.objects.all().delete()
AppUser.objects.all().delete()

def seed_appuser_edge_cases():
    print("\nAppUser Edge Cases")
    edge_users = [
        AppUser(email="dupe_email@test.com", name="John"),      # dupe name
        AppUser(email="dupe_email@test.com", name="Jim"),      # dupe name
        AppUser(email="name_too_big@test.com", name="A"*60),  # name exceeding max
        AppUser(email="empty_name@test.com", name=""),      # empty name
        AppUser(email="max_len_name@test.com", name="A"*50),  # max length name
        AppUser(email="normal@test.com", name="Normal")     # valid user
    ]

    for user in edge_users:
        try:
            user.full_clean()  # validate without saving
            user.save()
            print(f"Successfully created user: {user}")
        except ValidationError as e:
            print(f"Validation failed for {user}: {e}")

def seed_language_edge_cases():
    print("\nLanguage Edge Cases")
    edge_languages = [
        {"code": "es", "lang": "LangTooBig"*60},  # lang too big
        {"code": "it", "lang": "L"*50},  # max len lang
        {"code": "C"*60, "lang": "CodeTooBig"},  # code too big
        {"code": "C"*10, "lang": "MaxCodeLen"},  # max len code
        {"code": "fr", "lang": "French"}   # valid
    ]
    for l_data in edge_languages:
        # ** basically unpacks dictionary keys into keyword arguments.. just easier to write
        lang = Language(**l_data)
        try:
            lang.full_clean()
            lang.save()
            print(f"Successfully created language: {lang}")
        except ValidationError as e:
            print(f"Validation failed for {l_data}: {e}")

def seed_word_edge_cases():
    print("\nWord Edge Cases")
    edge_words = [
        {"label_en": "VeryLongMeaning", "meaning": "A"*5000},  # extremely long text
        {"label_en": "SpecialChars", "meaning": "!@#$%^&*()_+-=[]{};':,.<>/?"},  # symbols
        {"label_en": "UnicodeChars", "meaning": "😀🐍🚀漢字"},  # emojis and non-Latin chars
        {"label_en": "B"*300, "meaning": "Label too big"}, # max len label
        {"label_en": "", "meaning": "Empty label"},  # empty label
        {"label_en": "EmptyMeaning", "meaning": ""},  # empty meaning
        {"label_en": "B"*255, "meaning": "Max length label"}, # max len label
        {"label_en": "Apple", "meaning": "A common fruit"}, # valid
    ]
    for w_data in edge_words:
        word = Word(**w_data)
        try:
            word.full_clean()
            word.save()
            print(f"Successfully created word: {word}")
        except ValidationError as e:
            print(f"Validation failed for {w_data}: {e}")

def seed_translation_edge_cases():
    print("\nTranslation Edge Cases")
    lang = Language.objects.first()
    word = Word.objects.first()
    edge_translations = [
        # Normal
        Translation(
            target_lang_id=lang,
            word_id=word,
            label_target="Normal",
            example_target_easy="Easy example",
            example_en_easy="Easy example",
            example_target_med="Medium example",
            example_en_med="Medium example",
            example_target_hard="Hard example",
            example_en_hard="Hard example",
            audio_name="normal.mp3",
            audio_path="/audio/"
        ),
        # Max length label_target
        Translation(
            target_lang_id=lang,
            word_id=word,
            label_target="A"*255,
            example_target_easy="Easy example",
            example_en_easy="Easy example",
            example_target_med="Medium example",
            example_en_med="Medium example",
            example_target_hard="Hard example",
            example_en_hard="Hard example",
            audio_name="long_label.mp3",
            audio_path="/audio/"
        ),
        # Translation label_target too big
        Translation(
            target_lang_id=lang,
            word_id=word,
            label_target="A"*300,
            example_target_easy="Easy example",
            example_en_easy="Easy example",
            example_target_med="Medium example",
            example_en_med="Medium example",
            example_target_hard="Hard example",
            example_en_hard="Hard example",
            audio_name="translation_too_big.mp3",
            audio_path="/audio/"
        ),
        # Empty examples
        Translation(
            target_lang_id=lang,
            word_id=word,
            label_target="EmptyExamples",
            example_target_easy="",
            example_en_easy="",
            example_target_med="",
            example_en_med="",
            example_target_hard="",
            example_en_hard="",
            audio_name="empty_examples.mp3",
            audio_path="/audio/"
        ),
        # Special characters and unicode
        Translation(
            target_lang_id=lang,
            word_id=word,
            label_target="Spécial_Çhars",
            example_target_easy="😀🐍🚀漢字",
            example_en_easy="!@#$%^&*()",
            example_target_med="Medium 🚀 example",
            example_en_med="Medium example",
            example_target_hard="Hard 🏆 example",
            example_en_hard="Hard example",
            audio_name="special_chars.mp3",
            audio_path="/audio/special_chars.mp3"
        )
    ]
    for t in edge_translations:
        try:
            t.full_clean()
            t.save()
            print(f"Successfully created translation: {t.label_target}")
        except ValidationError as e:
            print(f"Validation failed for {t.label_target}: {e}")

def seed_userhistory_edge_cases():
    print("\nUserHistory Edge Cases")
    user = AppUser.objects.first()
    translation = Translation.objects.first()

    edge_history = [
        UserHistory(
            user_id=user,
            translation_id=translation,
            img_name="imgtoobig.png"*300,
            img_path="/images/",
            is_favorite=True
        ),
        UserHistory(
            user_id=user,
            translation_id=translation,
            img_name="pathtoobig.png",
            img_path="/images/"*300,
            is_favorite=True
        ),
        UserHistory(
            user_id=user,
            translation_id=translation,
            img_name="normal.png",
            img_path="/images/",
            is_favorite=True
        ),
        UserHistory(
            user_id=user,
            translation_id=translation,
            img_name="",  # empty image name
            img_path="",
            is_favorite=False
        )
    ]

    for h in edge_history:
        try:
            h.full_clean()
            h.save()
            print(f"Successfully created user history for: {h.user_id}")
        except ValidationError as e:
            print(f"Validation failed for UserHistory: {e}")

def seed_quiz_edge_cases():
    print("\nQuiz Edge Cases")

    user = AppUser.objects.first()
    lang = Language.objects.first()

    edge_quizzes = [
        Quiz(
            user_id=user,
            target_lang_id=lang,
            quiz_name="Normal Quiz"
        ),
        # Max-length quiz_name (50 chars)
        Quiz(
            user_id=user,
            target_lang_id=lang,
            quiz_name="A"*50
        ),
        # Empty quiz_name (should fail validation)
        Quiz(
            user_id=user,
            target_lang_id=lang,
            quiz_name=""
        ),
        # Duplicate quiz_name for same user (should fail unique-together)
        Quiz(
            user_id=user,
            target_lang_id=lang,
            quiz_name="Normal Quiz"
        ),
        # Null last_reviewed_at (allowed)
        Quiz(
            user_id=user,
            target_lang_id=lang,
            quiz_name="Quiz With Null Last Reviewed",
            last_reviewed_at=None
        ),
        # Special characters in quiz_name
        Quiz(
            user_id=user,
            target_lang_id=lang,
            quiz_name="Quiz_!@#$%^&*()_+|~`"
        )
    ]

    for q in edge_quizzes:
        try:
            q.full_clean()
            q.save()
            print(f"Successfully created quiz: {q.quiz_name}")
        except ValidationError as e:
            print(f"Validation failed for Quiz: {e}")

def seed_quizword_edge_cases():
    print("\nQuizWord Edge Cases")

    quiz = Quiz.objects.first()
    quiz2 = Quiz.objects.last()
    translation = Translation.objects.first()

    edge_quiz_words = [
        QuizWord(
            quiz_id=quiz,  # Normal Quiz
            translation_id=translation
        ),
        # Duplicate mapping for same quiz (should fail unique-together)
        QuizWord(
            quiz_id=quiz,
            translation_id=translation
        ),
        # Mapping to different quiz (allowed)
        QuizWord(
            quiz_id=quiz2,
            translation_id=translation
        )
    ]

    for qw in edge_quiz_words:
        try:
            qw.full_clean()
            qw.save()
            print(f"Successfully created QuizWord: {qw.quiz_id} - {qw.translation_id}")
        except ValidationError as e:
            print(f"Validation failed for QuizWord: {e}")

def run_edge_case_seeding():
    print("Running edge-case seeding...\n")
    seed_appuser_edge_cases()
    seed_language_edge_cases()
    seed_word_edge_cases()
    seed_translation_edge_cases()
    seed_userhistory_edge_cases()
    seed_quiz_edge_cases()
    seed_quizword_edge_cases()
    print("\nEdge-case seeding completed.")

if __name__ == "__main__":
    run_edge_case_seeding()