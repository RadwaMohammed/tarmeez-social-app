// add post modal
const addPostModal = document.getElementById('add-post-modal');
// add-post-body
const postBody = document.getElementById('post-body');
const postTitle = document.getElementById('post-title');
const postImg = document.getElementById('post-img');
// add post btn
const addPostBtn = document.getElementById('add-post-btn');
// Edit post btn
const editPostBtn = document.getElementById('edit-post-btn');
// post-id-holder
const postIdHolder = document.getElementById('post-id-holder');

const postsWrapper = document.getElementById('posts');
const deleteModal = document.getElementById('deleteModal')
const deleteBtn = document.getElementById('delete-btn');

// =============== Toggle modal (edit / new) post ============
// ======================================
const toggleModalForms = (isEditPost, postObject = '') => {
  postBody.value = '';
  postImg.classList.remove('is-invalid')
  addPostBtn.disabled = isNotEmpty(postBody);
  document.getElementById('addPostModalLabel').innerHTML = `${isEditPost ? 'Edit' : 'Add new'} post`;
  document.getElementById('post-img').value = '';
  if (isEditPost) {
    const post = JSON.parse(decodeURIComponent(postObject));
    addPostBtn.classList.add('hide-me');
    editPostBtn.classList.remove('hide-me');
    postTitle.value = post.title;
    postBody.value = post.body;
    postIdHolder.value = post.id;
  } else {
    addPostBtn.classList.remove('hide-me');
    editPostBtn.classList.add('hide-me');
    postTitle.value = '';
    postBody.value = '';
    postIdHolder.value = '';
  }
}
document.getElementById('add-btn-home').addEventListener('click', () => toggleModalForms(false));

// ======= function to Manage add or edit post ====
// ==============================================

const managePost = () => {
  showLoader(true);
  const postId = postIdHolder.value;
  const formData = new FormData();
  formData.append('title', postTitle.value.trim());
  formData.append('body', postBody.value.trim());
  // make add image to a post not required
  if (postImg.files[0]) {
    formData.append('image', postImg.files[0]);
  }
  const url = `${baseUrl}/posts${postId ? `/${postId}` : ''}`;
  if (postId) {
    // This is because of the technique the api was built 
    // and because of using formData
    formData.append('_method', 'put');
  }
  axios.post(url, formData, {
    headers: {
      'authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'multipart/form-data'
    }
  })
  .then(response => {
    showLoader(false);
    postsWrapper ? getPosts() : getPost()
    

    hideModal(addPostModal);
    if(!postId) {
      window.scrollTo({
        top: 0, 
        behavior: 'smooth'
      });
    }
    showAlert(`${postId ? 'Your' : 'New'} post has been ${postId ? 'edited' : 'created'} successfully`, 'success');
  }).catch(e => {
    e.response.data.errors.image ? postImg.classList.add('is-invalid') :  postImg.classList.remove('is-invalid');
    document.getElementById('post-imgFeedback').innerText = e.response.data.errors.image.join('\n')
    showAlert(e.response.data.message, 'danger')
  }).finally(() => {
    showLoader(false)
  })
}
  
// =============== Add post ============
// ======================================
postBody.addEventListener('input', () => {
  addPostBtn.disabled = isNotEmpty(postBody)
  editPostBtn.disabled = isNotEmpty(postBody)
})

postImg.addEventListener('input', () => postImg.classList.remove('is-invalid'))
addPostBtn.addEventListener('click', managePost);

// =============== Edit post ============
// ======================================
const editPost = postObject => {
  const editModal = new bootstrap.Modal(addPostModal, {});
  toggleModalForms(true, postObject);
  editModal.toggle()
  editPostBtn.addEventListener('click', managePost);
}

// =============== delete post ============
// ======================================
const confirmDelete = id => {
  const deleteConfirmModal = new bootstrap.Modal(deleteModal, {});
  deleteConfirmModal.toggle();
  const deletePost = postId => {
    showLoader(true);
    const formData = new FormData();
    formData.append('_method', 'delete');
    const url = `${baseUrl}/posts/${postId}`;
    axios.post(url, formData, {
      headers: {
        'authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'multipart/form-data'
      }
    })
    .then(response => {
      showLoader(false);
      showAlert('Your post has been deleted successfully', 'success')
      setTimeout(() => {
        hideModal(deleteModal);
        postsWrapper ? getPosts() :  window.location = `./index.html`;
      }, 1000)
      
      
    }).catch(e => showAlert(e.response.data.message, 'danger')).finally(() => showLoader(false))

  }
  deleteBtn.addEventListener('click', () => deletePost(id))
}
