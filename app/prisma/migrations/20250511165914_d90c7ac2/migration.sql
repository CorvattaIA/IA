-- CreateTable
CREATE TABLE "ChatMessage" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "sector" TEXT,
    "services" TEXT[],
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiagnosticResult" (
    "id" TEXT NOT NULL,
    "sector" TEXT NOT NULL,
    "usesAI" BOOLEAN NOT NULL,
    "concernLevel" TEXT NOT NULL,
    "teamTrained" BOOLEAN NOT NULL,
    "maturityLevel" TEXT NOT NULL,
    "recommendedServices" TEXT[],
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DiagnosticResult_pkey" PRIMARY KEY ("id")
);
