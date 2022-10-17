#include <unistd.h>

#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <unistd.h>
#include <fcntl.h>

#include <netinet/tcp.h>
#include <sys/socket.h>
#include <sys/types.h>
#include <netinet/in.h>
#include <netdb.h>

int socket_connect(char *host, in_port_t port, int *err){
	struct hostent *hp;
	struct sockaddr_in addr;
	int on = 1, sock;

	if((hp = gethostbyname(host)) == NULL){
		herror("gethostbyname");
		err = 1;
		return 0;
	}
	copy(hp->h_addr, &addr.sin_addr, hp->h_length);
	addr.sin_port = htons(port);
	addr.sin_family = AF_INET;
	sock = socket(PF_INET, SOCK_STREAM, IPPROTO_TCP);
	setsockopt(sock, IPPROTO_TCP, TCP_NODELAY, (const char *)&on, sizeof(int));

	if(sock == -1){
		perror("setsockopt");
		err = 2;
		return 0;
	}

	if(connect(sock, (struct sockaddr *)&addr, sizeof(struct sockaddr_in)) == -1){
		perror("connect");
		err = 3;
		return 0;
	}
	return sock;
}

#define BUFFER_SIZE 1024
int runReturnIfErr(char *port, char *addr)
{
    int err = 0;
    while(1)
    {
        fd = socket_connect(addr, atoi(port), err);
        if(err!=0) return err;
    	write(fd, "GET /\r\n", strlen("GET /\r\n")); // write(fd, char[]*, len);
    	bzero(buffer, BUFFER_SIZE);

    	while(read(fd, buffer, BUFFER_SIZE - 1) != 0){
    		fprintf(stderr, "%s", buffer);
    		bzero(buffer, BUFFER_SIZE);
    	}

    	shutdown(fd, SHUT_RDWR);
    	close(fd);
    	sleep(1)
    }
    return 0;
}
