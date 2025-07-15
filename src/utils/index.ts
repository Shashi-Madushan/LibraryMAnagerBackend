/**
 *  Grnarate randome user name 
 */

export const generateRandomUsername = (): string => {
    const prefix = "user_";
    const randomeChars = Math.random().toString(36).substring(2); 

    const randomUsername = `${prefix}${randomeChars}`;

    return randomUsername
}