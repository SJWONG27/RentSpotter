import { useState } from "react";

const useLogin = () => {

    const { login } = useAuth();
    const [ error, setError ] = useState(null);
    const [ loading, setLoading ] = useState(null);

    const loginUser = async(values) => {
        
        try{
            setError(null);
            setLoading(false);
            const res = await fetch('http://localhost:5000/api/auth/LogIn',{
                method:'POST',
                body: JSON.stringify(values),
            });
            
            const data = await res.json();
            if(res.status === 201){
                message.success(data.manage);
                login(data.toke, data.user);
            }
            else if(res.status === 4000){
                setError(data.message);
            }
            else{
                message.error('Register failed');
            }
        }catch(error){
            message.error(error);
        }finally{
            setLoading(false);
        }
    }

    return(
        <>
        loading,error,loginUser;
        </>
    );
};

export default useSignup;