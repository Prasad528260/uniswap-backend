import validator from 'validator'
 export const validateSignup=(firstName,lastName,email,password,department)=>{
    const ALLOWED_DEPT=["comps","it","mech","extc"];
    if (!firstName || !lastName || !department) {
        return;
    }
    if(!validator.isEmail(email))
    {
        throw new Error("Invalid Email");
    }
     if(!validator.isStrongPassword(password))
    {
        throw new Error("Make a Strong passsword");
    }
    if (!ALLOWED_DEPT.includes(department.toLowerCase())) {
        throw new Error("Not a Valid Department");
    }
    return true;
 }