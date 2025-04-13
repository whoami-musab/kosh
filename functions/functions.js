export function pagination(currentPage, totalPage){
    let paginationHTML = `<div class="flex gap-2">`
    for( let page = 1; page <= totalPage; page++ ) {
        paginationHTML += `<a href="?page=${page}" class='p-2 bg-white text-2xl text-black font-bold rounded-md' >${page}</a>`
    }
    paginationHTML += `</div>`
    return paginationHTML
}