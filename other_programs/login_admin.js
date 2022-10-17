// to console to browser
fetch( "http://localhost:8180/auth/login", {
      method: "POST",
      body: new URLSearchParams(
        `"login"="admin"&"password"="uGvUeZT4Cf9i+p2iwfGtK6JayulqfZQ8rjQKrLsfs5c="`
      ),
    })
      .then((response) => response.json())
      .then((data) => {
        setUser(data);
      })
      .catch(() => setNotification(badMsg(wrongLogin)));