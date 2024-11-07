const profileImageInput = document.getElementById('profileImage');
const profileCanvas = document.getElementById('profileCanvas');
const ctx = profileCanvas.getContext('2d');
let resizedImageBlob;

profileImageInput.addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        
        reader.onload = function(event) {
            const img = new Image();
            img.src = event.target.result;

            img.onload = function() {
    
                const targetWidth = 100; 
                const targetHeight = 100; 

              
                const aspectRatio = img.width / img.height;
                let drawWidth = targetWidth;
                let drawHeight = targetHeight;

                if (aspectRatio > 1) { 
                    drawHeight = targetHeight;
                    drawWidth = targetHeight * aspectRatio;
                } else { 
                    drawWidth = targetWidth;
                    drawHeight = targetWidth / aspectRatio;
                }

                
                ctx.clearRect(0, 0, profileCanvas.width, profileCanvas.height);
                ctx.drawImage(img, 0, 0, drawWidth, drawHeight);

                
                profileCanvas.toBlob((blob) => {
                    resizedImageBlob = blob;
                }, 'image/png');
            };
        };

        reader.readAsDataURL(file);
    }
});




document.getElementById('registerForm').addEventListener('submit',async (e)=>{
    e.preventDefault();
   
    const profile = document.getElementById('profileImage').value;
    const email = document.getElementById('useremail').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const nickname = document.getElementById('nickname').value;
    

    const profileHelper = document.getElementById('profileHelper');
    const emailHelper = document.getElementById('emailHelper');
    const passwordHelper = document.getElementById('passwordHelper');
    const confirmPasswordHelper = document.getElementById('confirmPasswordHelper');
    const nicknameHelper = document.getElementById('nicknameHelper');

    profileHelper.textContent="";
    emailHelper.textContent = "";
    passwordHelper.textContent = "";
    confirmPasswordHelper.textContent = "";
    nicknameHelper.textContent = "";

  
   
    let isValid=true;


    //프로필 유효성 검사
    if(!profile){
        profileHelper.textContent = "*프로필 사진을 추가해주세요.";
        profileHelper.style.visibility="visible";
        isValid=false;
    } else{
        profileHelper.style.visibility="hidden";
    }

    //이메일 유효성 검사
    if(!email){
       emailHelper.textContent='*이메일을 입력해주세요.';
       emailHelper.style.visibility="visible";
       isValid=false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        emailHelper.textContent= '*올바른 이메일 주소 형식을 입력해주세요. (예: example@example.com)';
        emailHelper.style.visibility="visible";
        isValid=false;
    } else if (await isEmailDuplicated(email)) { 
        emailHelper.textContent= '*중복된 이메일 입니다.';
        emailHelper.style.visibility="visible";
        isValid=false;
    } else {
        emailHelper.style.visibility = "hidden"; 
    }
   
    // 비밀번호 유효성 검사
    if (!password) {
        passwordHelper.textContent= '*비밀번호를 입력해주세요.';
        passwordHelper.style.visibility="visible";
        isValid=false;
    } else if (password.length < 8 || password.length > 20 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password) || !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
         passwordHelper.textContent= '*비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.';
         passwordHelper.style.visibility="visible";
         isValid=false;
        }  else {
        passwordHelper.style.visibility = "hidden";
    }

    // 비밀번호 확인 유효성 검사
    if (!confirmPassword) {
        confirmPasswordHelper.textContent = '*비밀번호를 한 번 더 입력해주세요.';
        confirmPasswordHelper.style.visibilty="visible";
        isValid=false;
    } else if (password !== confirmPassword) {
        confirmPasswordHelper.textContent = '*비밀번호가 다릅니다.';
        confirmPasswordHelper.style.visibility = "visible";
        isValid = false;
    } else {
        confirmPasswordHelper.style.visibility = "hidden";
    }

    // 닉네임 유효성 검사
    if (!nickname) {
        nicknameHelper.textContent = '*닉네임을 입력해주세요.';
        nicknameHelper.style.visibility="visible";
        isValid=false;
    } else if (nickname.length > 10) {
        nicknameHelper.textContent = '*닉네임은 최대 10자까지 작성 가능합니다.';
        nicknameHelper.style.visibility="visible";
        isValid=false;
    } else if (/\s/.test(nickname)) {
        nicknameHelper.textContent = '*띄어쓰기를 없애주세요.';
        nicknameHelper.style.visibility="visible";
        isValid=false;
    } else if (await isNicknameDuplicated(nickname)) { 
        nicknameHelper.textContent = '*중복된 닉네임 입니다.';
        nicknameHelper.style.visibility="visible";
        isValid=false;
    }

    console.log(isValid);
    if(isValid){
    const formData = new FormData(document.getElementById('registerForm'));

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
