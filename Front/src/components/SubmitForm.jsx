import React from "react";

const SubmitForm = ((props) => {
    return (
        <>
            <form>
            
                <textArea 
                    placeholder="Entrez votre code içi..." 
                    cols="130" 
                    rows="25"
                    wrap="off"
                >
                </textArea>

                <br />
                <br />

                <input 
                    type="submit" 
                    value="Envoyer" 
                />

            </form>
        </>
    )
});

export default SubmitForm;