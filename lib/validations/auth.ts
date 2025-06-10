import * as z from "zod";

export const loginSchema = z.object(
    {
        email: z.string().email(
            {message: "Invalid email format"}
        ),
        password: z.string()
    }
);

export const registerSchema = z.object(
    {
        email: z.string().email(
            {message: "Invalid email format"}
        ),
        password: z.string().min(8, {
            message: "Password must be at least 8 characters long" }
        ),
        confirmPassword: z.string(),
        terms: z.boolean().refine((val) => val == true, {
            message: "You must accept the terms and conditions"
        })
    }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
    }
);