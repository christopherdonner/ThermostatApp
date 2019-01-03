var authToken="c.s7K5ndoFFMrwvCbFypU2U29sRxlTQZ4jSJTvWD6zHLOxuRJjznVkm38MJi204sQrJnFhvQn3pygTeoM8IFLpLZfQwSlXE47zzs6JrPzGHW3X4FRW0FqNlbOi9sUYeBfFMnLePx1Gjfqn8MgS"

$.ajax({
    url: `https://developer-api.nest.com/?auth=${authToken}`,
    type: "GET",
    contentType: "application/json",
    //headers: { 'authorization': authToken}
    
    }).then(function (response)
    {
        console.log(response)
    })