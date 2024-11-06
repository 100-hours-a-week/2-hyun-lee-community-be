const withdrawBtn = document.getElementById('withdrawBtn');
const withdrawModal = document.getElementById('withdrawModal');
const withdrawCancelBtn = document.getElementById('withdrawCancelBtn');
const withdrawConfirmBtn = document.getElementById('withdrawConfirmBtn');


withdrawBtn.addEventListener('click', () => {
    withdrawModal.style.display = 'flex';
});


withdrawCancelBtn.addEventListener('click', () => {
    withdrawModal.style.display = 'none';
});

withdrawConfirmBtn.addEventListener('click', () => {
    withdrawModal.style.display = 'none';
    alert("회원 탈퇴되었습니다.")
    window.location.href = '/'; 
});