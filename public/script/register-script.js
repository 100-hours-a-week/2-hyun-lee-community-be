
document.getElementById('registerForm').addEventListener('submit',async (e)=>{
    e.preventDefault();
   
    const email = document.getElementById('useremail').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const nickname = document.getElementById('nickname').value;
    console.log(nickname);
    let errorMessage='';


    //이메일 유효성 검사
    if(!email){
        errorMessage+='*이메일을 입력해주세요\n';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errorMessage += '*올바른 이메일 주소 형식을 입력해주세요. (예: example@example.com)\n';
    } else if (await isEmailDuplicated(email)) { // 중복 확인 추가
        errorMessage += '*중복된 이메일 입니다.\n';
    }
   
    // 비밀번호 유효성 검사
    if (!password) {
        errorMessage += '*비밀번호를 입력해주세요.\n';
    } else if (password.length < 8 || password.length > 20) {
        errorMessage += '*비밀번호는 8자 이상, 20자 이하로 입력해야 합니다.\n';
    } else if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password) || !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        errorMessage += '*비밀번호는 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.\n';
    }

    // 비밀번호 확인 유효성 검사
    if (!confirmPassword) {
        errorMessage += '*비밀번호를 한 번 더 입력해주세요.\n';
    } else if (password !== confirmPassword) {
        errorMessage += '*비밀번호가 다릅니다.\n';
    }

    // 닉네임 유효성 검사
    if (!nickname) {
        errorMessage += '*닉네임을 입력해주세요.\n';
    } else if (nickname.length > 10) {
        errorMessage += '*닉네임은 최대 10자까지 작성 가능합니다.\n';
    } else if (/\s/.test(nickname)) {
        errorMessage += '*띄어쓰기를 없애주세요.\n';
    } else if (await isNicknameDuplicated(nickname)) { // 닉네임 중복 확인 추가
        errorMessage += '*중복된 닉네임 입니다.\n';
    }

    // 에러 메시지가 있으면 경고창을 표시하고 전송 중지
    if (errorMessage) {
        alert(errorMessage);
        return; // 유효성 검사 실패 시 서버로 데이터 전송하지 않음
    }
    
    const formData = new FormData(document.getElementById('registerForm'));

    for (let pair of formData.entries()) { // 모든 필드와 값을 확인
        console.log(pair[0]+ ', ' + pair[1]); 
    }

    try{
        const response= await fetch('/register',{
            method: 'POST',
            body: formData,
        });

        const result= await response.json();
        if(response.ok){
            alert('회원가입 성공: '+result.message);
            window.location.href='/';
        } else{
            alert('회원가입 실패: '+result.message);
        }
    } catch(error){
        console.error('Error:',error);
        alert('서버 오류 발생');
    }
})


// 이메일 중복 확인 함수
async function isEmailDuplicated(email) {
    try {
        const response = await fetch(`/check-email?email=${encodeURIComponent(email)}`);
        if (!response.ok) {
            throw new Error('서버 응답 오류');
        }
        const data = await response.json();
        return data.isDuplicated; // 서버에서 true/false 반환
    } catch (error) {
        console.error('이메일 중복 확인 중 오류 발생:', error);
        return true; // 오류가 발생하면 안전을 위해 중복된 것으로 처리
    }
}

// 닉네임 중복 확인 함수
async function isNicknameDuplicated(nickname) {
    try {
        const response = await fetch(`/check-nickname?nickname=${encodeURIComponent(nickname)}`);
        if (!response.ok) {
            throw new Error('서버 응답 오류');
        }
        const data = await response.json();
        return data.isDuplicated; // 서버에서 true/false 반환
    } catch (error) {
        console.error('닉네임 중복 확인 중 오류 발생:', error);
        return true; // 오류가 발생하면 안전을 위해 중복된 것으로 처리
    }
}
