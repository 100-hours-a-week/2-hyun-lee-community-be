document.getElementById('registerBtn').addEventListener('click', () => {
    window.location.href = '/register'; // 회원가입 페이지로 이동
});
document.getElementById('login').addEventListener('submit', async(e) => {
    e.preventDefault();
    const useremail=document.getElementById('useremail').value;
    const password=document.getElementById('password').value;

    //로그인 확인
    try{
        const response=await fetch('/login',{
            method: 'POST',
            headers:{
                'Content-Type':'application/json'
            },
           body: JSON.stringify({useremail,password})
        });
        const result=await response.json();
        if(response.ok){
            alert(result.message)
                window.location.href='/community';
        } else{
            
           alert(result.message);
            window.location.href='/';
        }
    } catch(error){
        console.log('로그인 요청 중 오류 발생:',error);
        alert('로그인 중 오류가 발생하였습니다. 다시 시도해주세요.');
    }
});