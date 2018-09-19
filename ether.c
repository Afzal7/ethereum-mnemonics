#include<stdio.h>

char sign(char private_key[512],char msg[512]);

int main(){

	printf("Hello world\n");

	printf("%d", sign("privateKey", "Message"));

	return 0;
}

char sign(char private_key[512],char msg[512]){

	puts(private_key);
	puts(msg);
}