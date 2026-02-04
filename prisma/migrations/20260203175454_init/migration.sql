-- CreateTable
CREATE TABLE "Proposal" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "proposalNumber" TEXT NOT NULL,
    "clientName" TEXT NOT NULL,
    "clientRole" TEXT NOT NULL,
    "clientCompany" TEXT NOT NULL,
    "clientIndustry" TEXT NOT NULL,
    "clientEmail" TEXT NOT NULL,
    "clientPhone" TEXT NOT NULL,
    "clientWebsite" TEXT,
    "clientLinkedin" TEXT,
    "mainObstacle" TEXT NOT NULL,
    "problemDuration" TEXT NOT NULL,
    "motivation" TEXT NOT NULL,
    "previousAttempts" TEXT NOT NULL,
    "whyFailed" TEXT NOT NULL,
    "consequences" TEXT NOT NULL,
    "idealSolution" TEXT NOT NULL,
    "objectives" TEXT NOT NULL,
    "beneficiaries" TEXT NOT NULL,
    "timeline" TEXT NOT NULL,
    "deadline" TEXT,
    "budget" TEXT NOT NULL,
    "decisionMaker" TEXT NOT NULL,
    "approvalProcess" BOOLEAN NOT NULL DEFAULT false,
    "approvalDetails" TEXT,
    "decisionFactors" TEXT NOT NULL,
    "packagesNumber" INTEGER NOT NULL DEFAULT 3,
    "selectedPackage" TEXT,
    "responseTime" TEXT NOT NULL,
    "concerns" TEXT,
    "wantsMeeting" BOOLEAN NOT NULL DEFAULT false,
    "meetingTime" TEXT,
    "howFound" TEXT NOT NULL,
    "additionalNotes" TEXT,
    "packages" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'SENT',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "validUntil" DATETIME NOT NULL,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "lastViewedAt" DATETIME,
    "pdfUrl" TEXT,
    "docxUrl" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "Proposal_proposalNumber_key" ON "Proposal"("proposalNumber");

-- CreateIndex
CREATE INDEX "Proposal_clientEmail_idx" ON "Proposal"("clientEmail");

-- CreateIndex
CREATE INDEX "Proposal_createdAt_idx" ON "Proposal"("createdAt");

-- CreateIndex
CREATE INDEX "Proposal_proposalNumber_idx" ON "Proposal"("proposalNumber");
