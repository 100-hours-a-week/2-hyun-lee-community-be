document.getElementById('createBtn').addEventListener('click', () => {
    window.location.href = '/create-post'; 
});

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/posts'); 
        const posts = await response.json(); 
        renderPosts(posts); 
    } catch (error) {
        console.error('게시글 데이터를 불러오는 중 오류가 발생했습니다:', error);
    }
});

function renderPosts(posts){
    const postTableBody = document.getElementById('postTableBody');
    postTableBody.innerHTML='';
    posts[0].forEach(post => {
        const newRow=document.createElement('tr');
        newRow.className = 'post-item'; 
        newRow.innerHTML=`
             <div class="post-header">
                    <h2 class=post-title data-id=${post.board_id}> ${post.page_title}</h2>
                </div>
                <div class="post-details">
                    <div class="post-details2"><span>좋아요 ${post.likes_count}</span> <span>댓글 ${post.comment_count}</span> <span>조회수 ${post.view_count}</span></div>
                    <span class="post-date">${formatDate(post.create_at)}</span>
                </div>
                <div class="post-footer">
                    <img class="author-avatar" src=${post.profile}></img>
                    <span class="author-name">${post.nickname}</span>
                </div>
        `;
        postTableBody.appendChild(newRow);
        newRow.querySelector('.post-header').addEventListener('click', () => {
            window.location.href = `/detail-post?board_id=${post.board_id}`;
        });
        
    });
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
