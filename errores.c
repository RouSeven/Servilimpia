#include <stdio.h>
int main() {
    int x = 10;
    if (x = 5) { // Error semántico: asignación en lugar de comparación
        printf("x es 5\n");
    }
    return 0;
}



