document.getElementById('registerBtn').addEventListener('click', () => {
    window.location.href = '/register'; // 회원가입 페이지로 이동
});
document.getElementById('login').addEventListener('submit', async(e) => {
    e.preventDefault();
    const email=document.getElementById('useremail').value;
    const password=document.getElementById('password').value;


    const emailHelper=document.getElementById('emailHelper');
    const passwordHelper=document.getElementById('passwordHelper');

    let isValid=true;

    passwordHelper.textContent="";
    
    //이메일 유효성 검사
    if(!email){
        emailHelper.textContent='*올바른 이메일 주소 형식을 입력해주세요. (예: example@example.com)';
        emailHelper.style.visibility="visible";
        isValid=false;
     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
         emailHelper.textContent= '*올바른 이메일 주소 형식을 입력해주세요. (예: example@example.com)';
         emailHelper.style.visibility="visible";
         isValid=false;
     } else{
        emailHelper.style.visibility="hidden";
     }

     //비밀번호 유효성 검사
     if (!password) {
        passwordHelper.textContent= '*비밀번호를 입력해주세요.';
        passwordHelper.style.visibility="visible";
        isValid=false;
    } else if(password.length < 8 || password.length > 20 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password) || !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
         passwordHelper.textContent= '*비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.';
         passwordHelper.style.visibility="visible";
         isValid=false;
    } else if(! await isLoginDuplicated(email,password)){
        passwordHelper.textContent= '*비밀번호가 다릅니다.';
        passwordHelper.style.visibility="visible";
        isValid=false;
    }

    if(isValid){
    //로그인 확인
    try{
        const response=await fetch('/login',{
            method: 'POST',
            headers:{
                'Content-Type':'application/json'
            },
           body: JSON.stringify({email,password})
        });
        const result=await response.json();
        console.log(result);
        if(response.ok){
                window.location.href='/community';
        } 
    } catch(error){
        console.log('로그인 요청 중 오류 발생:',error);
        alert('로그인 중 오류가 발생하였습니다. 다시 시도해주세요.');
    }
}
});

// 비밀번호 확인 함수
async function isLoginDuplicated(email,password) {
    try {
        const response = await fetch(`/check-login`,{ method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        return data.success; 
    } catch (error) {
        console.error('비밀번호 확인 중 오류 발생:', error);
    }
}