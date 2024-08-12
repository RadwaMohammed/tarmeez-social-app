const getPostId = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('id');
}
const postId = getPostId();
const userHeader = document.querySelector('.post-details h1 strong');
const postHeader = document.getElementById('post-header');
const postFigure = document.getElementById('post-figure');
const addCommentForm = document.getElementById('add-comment');
const postFooter = document.querySelector('.top-content');
const addCommentBtn = document.getElementById('add-comment-btn');
const commentBody = document.getElementById('comment-content');
const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user'));

 
const getPost = () => {
  axios.get(`${baseUrl}/posts/${postId}`)
  .then(response => {
    const { 
      author, 
      comments, 
      body, 
      title, 
      image,
      tags, 
      created_at,
      comments_count
    } = response.data.data;
    console.log(response.data.data)
    const getTags = tags => {
      let content = '';
      for (let tag of tags) {
        content += `
        <li>
          <button type="button" class="btn btn-secondary bg-secondary">${tag.name}</button>
        </li>`;
      }
      return content;
    };

    const getComments = comments => {
      let content = '';
      for (let comment of comments) {
        const { profile_image, username } = comment.author;
        let userImg = `<img src="${profile_image}" alt="${username}" class="border border-1 rounded-circle">`;
        content += `
        <li class="p-1">
          <h4 title="${comment.author.username}" class="comment d-flex align-items-center gap-2">
          ${profile_image && typeof profile_image === 'string'? userImg : defaultUserImg} ${username}
          </h4>
          <p class="p-2">${comment.body}</p>
        </li>`;
      }
      return content;
    }

    userHeader.innerHTML = author.username;
    const userImg = `<img src="${author.profile_image}" alt="${author.name}" class="border border-1 rounded-circle">`;
    const headerContent = `<h2 class="card-header d-flex align-items-center gap-2">
      ${author.profile_image && typeof author.profile_image === 'string'? userImg : defaultUserImg}@${author.username}
      </h2>`;
      
    const figureContent = `${typeof image === 'string' &&  image.length ? `<img src="${image}" alt="${title || ''}" class="img-fluid card-img-top">` : ''}
      <time class="text-body-tertiary fw-medium d-block mt-1">${created_at}</time>
      <figcaption class="mt-3">
        <h3 class="card-title">${title || ''}</h3>
        <p class="card-text">${body || ''}</p>
      </figcaption>`;

    const footerContent = `<div class="wrapper gap-1">
      <div class="comments d-flex align-items-center ">
        <p class="d-flex text-body-secondary fw-medium align-items-center gap-1">
         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chat-square" viewBox="0 0 16 16">
          <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-2.5a2 2 0 0 0-1.6.8L8 14.333 6.1 11.8a2 2 0 0 0-1.6-.8H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2.5a1 1 0 0 1 .8.4l1.9 2.533a1 1 0 0 0 1.6 0l1.9-2.533a1 1 0 0 1 .8-.4H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
        </svg>
          (${comments_count}) Comments
        </p>
      </div>
      ${tags.length ? `<ul class="tags nav gap-1">${getTags(tags)}</ul>` : ''}
    </div>
    ${comments.length ? `<ul class="comments-container nav flex-column p-3 mt-2 card-img-bottom">${getComments(comments)}</ul>` : ''}`;
    postHeader.innerHTML = headerContent;
    postFigure.innerHTML = figureContent;
    postFooter.innerHTML = footerContent;
  })
};

addCommentBtn.disabled = isNotEmpty(commentBody);
commentBody.addEventListener('input', () => addCommentBtn.disabled = isNotEmpty(commentBody));
addCommentBtn.addEventListener('click', () => {
  const params = {
    'body': commentBody.value.trim()
  }
  axios.post(`${baseUrl}/posts/${postId}/comments`, params, {
    headers: {
      'authorization': `Bearer ${localStorage.getItem('token')}`,
    }
  }).then(() => {
    getPost();
    showAlert('New comment has been created successfully', 'success')

  }).catch(e => showAlert(`${e.response.data.message}`, 'danger'))
});

getPost();