export default class APIService{
    static loginUser(email){
        return fetch(`http://127.0.0.1:5000/login`,{
            'method':'POST',
            headers : {
                'Content-Type':'application/json'
            },
            body:JSON.stringify(email)
        })
        .then (response => response.json())
        .catch(error => console.log(error))
    }

}