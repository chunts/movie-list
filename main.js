(function () {

  //   write your code here 
  const BASE_URL = 'https://movie-list.alphacamp.io'
  const INDEX_URL = BASE_URL + '/api/v1/movies/'
  const POSTER_URL = BASE_URL + '/posters/'
  const data = []

  //search
  const searchBtn = document.getElementById('submit-search')
  const searchInput = document.getElementById('search')

  //pagination
  const pagination = document.getElementById('pagination')
  const ITEM_PER_PAGE = 12
  let paginationData = []

  //cutover
  const cutover = document.getElementById('cutover')
  //判斷切換模式的 Boolean
  let isListMode = false
  //頁數預設在第一頁
  let page = 1

  const dataPanel = document.getElementById('data-panel')


  axios.get(INDEX_URL).then((response) => {
    data.push(...response.data.results)
    console.log(data)
    getTotalPages(data)
    getPageData(1, data)
  }).catch((err) => console.log(err))

  // listen to data panel
  dataPanel.addEventListener('click', (event) => {
    if (event.target.matches('.btn-show-movie')) {
      console.log(event.target.dataset.id)
      showMovie(event.target.dataset.id)
    } else if (event.target.matches('.btn-add-favorite')) {
      console.log(event.target.dataset.id)
      addFavoriteItem(event.target.dataset.id)
    }
  })

  //呈現電影列表
  function displayDataList(data) {
    let htmlContent = ''

    if (!isListMode) {
      console.log(isListMode)
      data.forEach(function (item, index) {
        htmlContent += `
              <div class="col-sm-3">
                <div class="card mb-2">
                  <img class="card-img-top " src="${POSTER_URL}${item.image}" alt="Card image cap">
                  
                  <div class="card-body movie-item-body">
                    <h6 class="card-title">${item.title}</h5>
                  </div>
  
                  <!-- "More" button -->
                  <div class="card-footer">
                    <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#show-movie-modal" data-id="${item.id}">More</button>
                    <!-- favorite button --> 
                    <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
                  </div>
  
                </div>
              </div>
            `
      })
    } else if (isListMode) {
      console.log(isListMode)
      data.forEach(function (item, index) {
        htmlContent += `
              <div class="container">
                <div class="row size">
                  <div class="col-8">
                    <h5>${item.title}</h5>
                  </div>
                  <div class="col-4">
                    <button class="btn btn-primary btn-show-movie mt-1 mb-1 mr-2" data-toggle="modal" data-target="#show-movie-modal" data-id="${item.id}">More</button>
                    <!-- favorite button --> 
                    <button class = "btn btn-info btn-add-favorite mt-1 mb-1" data-id ="${item.id}" > + </button>
                  </div>
                </div>
              </div>
            `
      })
    }


    dataPanel.innerHTML = htmlContent
  }

  function showMovie(id) {
    // get elements
    const modalTitle = document.getElementById('show-movie-title')
    const modalImage = document.getElementById('show-movie-image')
    const modalDate = document.getElementById('show-movie-date')
    const modalDescription = document.getElementById('show-movie-description')

    // set request url
    const url = INDEX_URL + id
    console.log(url)

    // send request to show api
    axios.get(url).then(response => {
      const data = response.data.results
      console.log(data)

      // insert data into modal ui
      modalTitle.textContent = data.title
      modalImage.innerHTML = `<img src="${POSTER_URL}${data.image}" class="img-fluid" alt="Responsive image">`
      modalDate.textContent = `release at : ${data.release_date}`
      modalDescription.textContent = `${data.description}`
    })
  }

  //加入喜愛的電影到清單
  function addFavoriteItem(id) {
    const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
    const movie = data.find(item => item.id === Number(id))

    if (list.some(item => item.id === Number(id))) {
      alert(`${movie.title} is already in your favorite list.`)
    } else {
      list.push(movie)
      alert(`Added ${movie.title} to your favorite list!`)
    }
    localStorage.setItem('favoriteMovies', JSON.stringify(list))

  }

  //搜尋按鈕
  searchBtn.addEventListener('click', event => {
    let results = []
    event.preventDefault()

    const regex = new RegExp(searchInput.value, 'i')

    results = data.filter(movie => movie.title.match(regex))
    console.log(results)
    //displayDataList(results)

    getTotalPages(results)
    getPageData(1, results)
  })

  //實作分頁
  //pagination 標籤的事件監聽器
  pagination.addEventListener('click', event => {
    console.log(event.target.dataset.page)
    if (event.target.tagName === 'A') {
      getPageData(event.target.dataset.page)
    }
  })

  function getTotalPages(data) {
    let totalPages = Math.ceil(data.length / ITEM_PER_PAGE) || 1
    let pageItemContent = ''
    for (let i = 0; i < totalPages; i++) {
      pageItemContent += `
        <li class="page-item">
          <a class="page-link" href="javascript:;" data-page="${i + 1}">${i + 1}</a>
        </li>
      `
    }
    pagination.innerHTML = pageItemContent
  }

  function getPageData(pageNum, data) {
    paginationData = data || paginationData
    let offset = (pageNum - 1) * ITEM_PER_PAGE
    let pageData = paginationData.slice(offset, offset + ITEM_PER_PAGE)
    displayDataList(pageData)
  }

  //cutover list or card page
  cutover.addEventListener('click', function (event) {
    if (event.target.matches('#cut-card')) {
      console.log('cut-card')
      isListMode = false
    } else if (event.target.matches('#cut-list')) {
      console.log('cut-list')
      isListMode = true
    }

    getPageData(page)
  })

})()  