

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const boardId = urlParams.get('board_id');
    

    try {
        const response = await fetch(`/api/detail-post?board_id=${boardId}`); 
        const post = await response.json(); 
        renderPost(post); 
    } catch (error) {
        console.error('게시글 데이터를 불러오는 중 오류가 발생했습니다:', error);
    }
});



function renderPost(posts){
    const postTableBody = document.getElementById('container');
    const post = posts[0][0];
    postTableBody.innerHTML=`
   
            <span class="title">${post.page_title}</span>
            <div class="post-header">
                <div class="post-footer">
                    <div class="author-avatar"></div>
                    <span class="author-name">${post.nickname}</span>
                    <span class="post-date">${post.create_at}</span>
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

     
          <div class="comment-section">
            <textarea placeholder="댓글을 남겨주세요! "></textarea>
            <button class="comment-submit">댓글 등록</button>
        </div>

   
        <div class="comment">
                <div class="comment-author">
                    <div class="author-avatar"></div>
                    <div class="comment-details">
                    <span class="author-name">더미 작성자 1</span>
                    <span class="comment-date">2021-01-01 00:00:00</span>
                    <p class="comment-content">댓글 내용</p>
                    </div>
                </div>
                <div class="comment-author">
                    <div class="author-avatar"></div>
                    <div class="comment-details">
                    <span class="author-name">더미 작성자 1</span>
                    <span class="comment-date">2021-01-01 00:00:00</span>
                    <p class="comment-content">댓글 내용</p>
                    </div>
                </div>
                <div class="comment-author">
                    <div class="author-avatar"></div>
                    <div class="comment-details">
                    <span class="author-name">더미 작성자 1</span>
                    <span class="comment-date">2021-01-01 00:00:00</span>
                    <p class="comment-content">댓글 내용</p>
                    </div>
                </div>
                <div class="comment-author">
                    <div class="author-avatar"></div>
                    <div class="comment-details">
                    <span class="author-name">더미 작성자 1</span>
                    <span class="comment-date">2021-01-01 00:00:00</span>
                    <p class="comment-content">댓글 내용</p>
                    </div>
                </div>
                <div class="action">
                <button class="comment-action">수정</button>
                <button class="comment-action">삭제</button>
                </div>
                

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
  
    const postModal = document.querySelector('.post-modal');
    const postDeleteBtn = document.querySelector('.delete-post-button'); 
    const postCancelBtn = document.querySelector('.post-cancel');
    const postConfirmBtn = document.querySelector('.post-confirm');
    
    const commentModal = document.querySelector('.comment-modal');
    const commentDeleteBtn = document.querySelector('.delete-comment-button'); 
    const commentCancelBtn = document.querySelector('.comment-cancel');
    const commentConfirmBtn = document.querySelector('.comment-confirm');
    
    
    
    
    
    postDeleteBtn.addEventListener('click',()=>{
        postModal.style.display='flex';
    })
    
    commentDeleteBtn.addEventListener('click',()=>{
        commentModal.style.display='flex';
    })
    
    
    postCancelBtn.addEventListener('click',()=>{
        postModal.style.display='none';
    })
    
    commentCancelBtn.addEventListener('click',()=>{
        commentModal.style.display='none';
    })
    
    commentConfirmBtn.addEventListener('click', () => {
        commentModal.style.display = 'none';
        alert('댓글이 삭제되었습니다.');
    });
    
    
    postConfirmBtn.addEventListener('click', () => {
        postModal.style.display = 'none';
        alert('게시글이 삭제되었습니다.');
    });
    
}