

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const boardId = urlParams.get('board_id');
    

    try {
        const response = await fetch(`/api/detail-post?board_id=${boardId}`); 
        const post = await response.json(); 
        renderPost(post); 


         const commentsResponse = await fetch(`/comments?board_id=${boardId}`);
         const results = await commentsResponse.json();
         console.log(results.resultData);
         comments=results.resultData;
         userId=results.userId;
         comments.forEach(comment => addCommentToList(comment,userId)); 


    const postModal = document.querySelector('.post-modal');
    const postDeleteBtn = document.querySelector('.delete-post-button'); 
    const postCancelBtn = document.querySelector('.post-cancel');
    const postConfirmBtn = document.querySelector('.post-confirm');
    
    const commentModal = document.querySelector('.comment-modal');
    const commentDeleteBtn = document.querySelectorAll('.delete-comment-button'); 
    const commentCancelBtn = document.querySelector('.comment-cancel');
    const commentConfirmBtn = document.querySelector('.comment-confirm');
    
    
    
    
    
    postDeleteBtn.addEventListener('click',()=>{
        postModal.style.display='flex';
       
        document.body.style.overflow = 'hidden'; 
    })
    
    commentDeleteBtn.forEach(button=>{
        button.addEventListener('click',()=>{
        commentModal.style.display='flex';
        document.body.style.overflow = 'hidden';
        const commentId = button.closest('.comment-details').getAttribute('data-comment-id');
        commentConfirmBtn.setAttribute('data-comment-id',commentId); 
        })
    });
    
    
    postCancelBtn.addEventListener('click',()=>{
        postModal.style.display='none';
        document.body.style.overflow = 'auto'; 
    })
    
    commentCancelBtn.addEventListener('click',()=>{
        commentModal.style.display='none';
        document.body.style.overflow = 'auto'; 
    })
    
    commentConfirmBtn.addEventListener('click', async() => {
        const commentId = commentConfirmBtn.getAttribute('data-comment-id');
       const response = await fetch(`/comment/${boardId}/deleteComment/${commentId}`,{
            method: 'DELETE'
       });

        
        commentModal.style.display = 'none';
        document.body.style.overflow = 'auto'; 
        window.location.href = `/detail-post?board_id=${boardId}`; 
    });
    
    
    postConfirmBtn.addEventListener('click', async() => { 
    
        const response = await fetch(`/details-post/deletePost?board_id=${boardId}`,{
            method: 'DELETE'
        });
        const result = await response.json();
        if(response.ok){
            postModal.style.display = 'none';
            document.body.style.overflow = 'auto'; 
            window.location.href = '/community'; 
        } else{
            alert(result.message);
        }
       
    });

 
    } catch (error) {
        console.error('게시글 데이터를 불러오는 중 오류가 발생했습니다:', error);
    }
});

document.getElementById('comment-submit').addEventListener('click', async () => {
    const commentContent = document.getElementById('commentInput').value;
    const urlParams = new URLSearchParams(window.location.search);
    const boardId =  parseInt(urlParams.get('board_id'), 10);

    if (!commentContent.trim()) {
        alert("댓글 내용을 입력해주세요.");
        return;
    }

    try {
        const response = await fetch('/comment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ boardId, content: commentContent })
        });

        const result = await response.json();
        comments=result.resultData;
        userId=result.userId;
        if (response.ok) {
            document.getElementById('commentInput').value = ''; 
            addCommentToList(comments,userId);
            window.location.href = `/detail-post?board_id=${boardId}`;
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error("댓글 작성 중 오류:", error);
    }
});


function addCommentToList(commentData,userId) {
    const commentList = document.getElementById('commentList');
    const newComment = document.createElement('div');
    newComment.classList.add('comment-author');
    
    const isOwner = commentData.user_id === userId;
    const editButtons = isOwner

        ? `  <div class="comment">
            <button class="modify-comment-button">수정</button>
            <button class="delete-comment-button">삭제</button>
            </div>`
        : ''; 

    newComment.innerHTML = `
       <img class="author-avatar" src=${commentData.profile}></img>
        <div class="comment-details" data-comment-id=${commentData.comment_id}>
            <span class="author-name">${commentData.nickname}</span>
            <span class="comment-date">${formatDate(commentData.create_at)}</span>
            <p class="comment-content">${commentData.content}</p>
             ${editButtons}
        </div>
    `;
    commentList.appendChild(newComment);
}


function renderPost(posts){
    const postTableBody = document.getElementById('container');
    const post = posts[0][0];
    postTableBody.innerHTML=`
   
            <span class="title">${post.page_title}</span>
            <div class="post-header">
                <div class="post-footer">
                    <div class="author-avatar"></div>
                    <span class="author-name">${post.nickname}</span>
                    <span class="post-date">${formatDate(post.create_at)}</span>
                </div>
                <span class="work-post">
                    <button class="modify-post-button">수정</button>
                    <button class="delete-post-button">삭제</button>
                </span>
            </div>
        <div class="post-details">
            <div class="post-image">
              <img src="${post.page_image}" alt="본문 이미지">
            </div>
        </div>
        <div class="post-content">
            <p>
                ${post.page_content}
            </p>
        </div>

     
        <div class="post-stats">
            <div class="stat-item">
                 <span class="stat-number">${post.likes_count}</span>
                 <span class="stat-label">좋아요수</span>
            </div>

            <div class="stat-item">
                <span class="stat-number">${post.view_count}</span>
                <span class="stat-label">조회수</span>
            </div>

            <div class="stat-item">
            <span class="stat-number">${post.comment_count}</span>
            <span class="stat-label">댓글</span>
            </div>
        </div>

     
          


        <div class="comment">
                

                <div class="modal post-modal">
                <div class="modal-content">
                    <h2>게시글을 삭제하시겠습니까?</h2>
                    <p>삭제한 내용은 복구 할 수 없습니다.</p>
                <div class="modal-buttons">
                    <button class="btn post-cancel">취소</button>
                    <button class="btn post-confirm">확인</button>
                </div>
            </div>
        </div>

        <div class="modal comment-modal">
            <div class="modal-content">
                <h2>댓글을 삭제하시겠습니까?</h2>
                <p>삭제한 내용은 복구 할 수 없습니다.</p>
                <div class="modal-buttons">
                    <button class="btn comment-cancel">취소</button>
                    <button class="btn comment-confirm">확인</button>
                </div>
            </div>
        </div>

        </div>`;
  
    
    
}

    

// 날짜 형식을 변환하는 함수
function formatDate(isoString) {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}