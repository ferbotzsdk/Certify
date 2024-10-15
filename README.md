# Certify
A micro service for validating bearer token

# How to use

````
try {  
    await validateAuth(req.headers['authorization'])  
    ......  
}catch (error) {  
    res.status(error.code).send({message: error.message});  
}