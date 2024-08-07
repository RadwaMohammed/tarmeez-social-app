
const getPostId = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('id');
}
const postId = getPostId();
const userHeader = document.querySelector('.post-details h1 strong');
const post = document.getElementById('post');
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
    const content = `
      <article class="card my-4 shadow-sm">
      <header>
        <h2 class="card-header d-flex align-items-center gap-2" title="${author.username}">
        ${author.profile_image && typeof author.profile_image === 'string'? userImg : defaultUserImg} @${author.username}
        </h2>
      </header>
      <div class="card-body">
        <figure>
          ${typeof image === 'string' &&  image.length ? `<img src="${image}" alt="${title || ''}" class="img-fluid card-img-top">` : ''}
          <time class="text-body-tertiary fw-medium d-block mt-1">${created_at}</time>
          <figcaption class="mt-3">
            <h3 class="card-title">${title || ''}</h3>
            <p class="card-text">${body || ''}</p>
          </figcaption>
        </figure>
        <footer class="border-top pt-2">
          <div class="wrapper gap-1">
            <div class="comments d-flex align-items-center ">
              <button class="d-block text-body-secondary">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                  <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
                </svg>
              </button>
                <p class="text-body-secondary fw-medium">(${comments_count}) Comments</p>
            </div>
            ${tags.length ? `<ul class="tags nav gap-1">${getTags(tags)}</ul>` : ''}
          </div>
          ${comments.length ? `<ul class="comments-container nav flex-column p-3 mt-2 card-img-bottom">${getComments(comments)}</ul>` : ''}
        </footer>
      </div>
    </article>
    `;
    post.innerHTML += content;
  })
};

getPost()