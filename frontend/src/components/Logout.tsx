
export default function Logout() {
    const attemptLogout = async () => {

        // TODO: CHANGE THIS URL
        const data = await fetch('http://localhost:8000/api/logout', {
            method: "post",
            headers: { "Content-Type": "application/json" },
            credentials: 'include'
        });

        const upload_response = await data.json();
        if (upload_response) {
            console.log("Successful logout attempt");
            window.location.replace('http://localhost:3000/login')
        } else {
            console.log("Error Found");
        }
    }

    return (
        <>
        <form className="login_form" onSubmit={attemptLogout}>
            <button className="upload_button" type="submit" name="upload">
                Logout
            </button>
        </form>
        </>
    )
}