export default class Validation {

    static minLength(name, min) {
        if (name.length < min) {
            return false;
        }
        return true;
    }

    static validName(value) {
        if (!/^[A-Za-z]+$/.test(value)) {
            return false;
        }
    
        if (/\s/.test(value)) {
            return false;
        }
    
        return true;
    }

}