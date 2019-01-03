$.ajax({
    url: "https://developer-api.nest.com",
    method: "GET",
    // Our data is the FormData object we set up above.
    //data: fd,
    contentType: "application/json",
    //processData: false,
    //dataType: 'json',
    //contentType: 'application/json; charset=utf-8',
    beforeSend: function(request) {
       request.setRequestHeader( "authorization", "Bearer c.s7K5ndoFFMrwvCbFypU2U29sRxlTQZ4jSJTvWD6zHLOxuRJjznVkm38MJi204sQrJnFhvQn3pygTeoM8IFLpLZfQwSlXE47zzs6JrPzGHW3X4FRW0FqNlbOi9sUYeBfFMnLePx1Gjfqn8MgS")
     }
    //headers:{"authorization": "Bearer c.s7K5ndoFFMrwvCbFypU2U29sRxlTQZ4jSJTvWD6zHLOxuRJjznVkm38MJi204sQrJnFhvQn3pygTeoM8IFLpLZfQwSlXE47zzs6JrPzGHW3X4FRW0FqNlbOi9sUYeBfFMnLePx1Gjfqn8MgS"}
    
    }).then(function (response)
    {
        console.log(response)
    })