-- CreateTable
CREATE TABLE "Order" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "category" TEXT NOT NULL,
    "item" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" INTEGER NOT NULL,
    "totalPrice" INTEGER NOT NULL,
    "unitPriceText" TEXT NOT NULL,
    "totalPriceText" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'placed',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
