document.getElementById('postForm').addEventListener('submit',async (e)=>{
    e.preventDefault();

    const postTitle=document.getElementById('postTitle').value;
    const postContent=document.getElementById('postContent').value;


    let errorMessage='';

    if(postTitle.length>26) errorMessage+='제목을 26자 이하로 작성해주세요.';

    if (errorMessage) {
        alert(errorMessage);
        return; // 유효성 검사 실패 시 서버로 데이터 전송하지 않음
    }

    const formData = new FormData(document.getElementById('postForm'));

    try{
        const response= await fetch('/createPost',{
            method: 'POST',
            body: formData,
        });
        const result= await response.json();
        console.log('result:',result);
        if(response.ok){
            alert(result.message);
            window.location.href='/community';
        } else{
            alert(result.message);
        }
    } catch(error){
        console.error('Error:',error);
        alert('서버 오류 발생');
    }
})