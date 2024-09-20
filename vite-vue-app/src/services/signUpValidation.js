import Validation from "./validation";

export default class signUpValidation {
    constructor(name, password){
        this.name = name;
        this.password = password;
    }

    checkValidation(){
        let errors = [];
        if(!Validation.validName(this.name)){
            errors["name"] = "Nom invalide (pas d'espace et que des letres.)"
        }


        if(!Validation.minLength(this.password, 6)){
            errors["password"] = "Le mot de passe doit contenir au moins 6 caractères."
        }

        return errors;
    }

}