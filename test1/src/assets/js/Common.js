import axios from 'axios'

export function getHttpResponse(url,param){  
    
    return new Promise(function(resolve,reject){
       axios.post(url,param)
        .then((response) => {
            resolve(response);
        })
        .catch((error) => {
            alert("서버와 통신중 오류가 발생하였습니다.");
            reject(new Error("서버와 통신중 오류가 발생하였습니다.[" + error + "]"));
        })
    });

}

export function pageDataSetting(pageInfo) {                
    const totalPage = pageInfo.totalPageCount;                
    const block = pageInfo.pageSize;
    const page = pageInfo.currentPageNo;                                
    let currentPage = page;

    let startIndex = (Math.ceil(currentPage / block) - 1) * block + 1;
    let endIndex = startIndex + block > totalPage ? totalPage : startIndex + block - 1;
    
    let first = null;
    let end = null;

    if(endIndex < totalPage){                      
        end = endIndex + 1;
    }

    if(startIndex > 1){                    
        first = startIndex - block;
    }

    let list = []
    for (let index = startIndex; index <= endIndex; index++) {
        list.push(index)
    }                
    return { first, end, list, currentPage , totalPage}
}