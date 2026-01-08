
export const validateBook = ({title,subject,condition,price,description,category,author}) => {
    if(!title || !subject || !author || !condition || !price || !description || !category){
        throw new Error("All fields are required")
    }
    return true;
}