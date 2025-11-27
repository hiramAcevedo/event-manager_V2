-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('BODA', 'CUMPLEANOS', 'XV_ANOS', 'CORPORATIVO', 'CONFERENCIA', 'BAUTIZO', 'ANIVERSARIO', 'GRADUACION', 'BABY_SHOWER', 'OTRO');

-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "location" TEXT NOT NULL,
    "organizer" TEXT NOT NULL,
    "eventType" "EventType" NOT NULL DEFAULT 'OTRO',
    "maxAttendees" INTEGER NOT NULL DEFAULT 0,
    "currentAttendees" INTEGER NOT NULL DEFAULT 0,
    "isVirtual" BOOLEAN NOT NULL DEFAULT false,
    "isSurprise" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Guest" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "origin" TEXT,
    "companions" INTEGER NOT NULL DEFAULT 0,
    "confirmed" BOOLEAN NOT NULL DEFAULT false,
    "relationship" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "eventId" INTEGER NOT NULL,

    CONSTRAINT "Guest_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Guest" ADD CONSTRAINT "Guest_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
