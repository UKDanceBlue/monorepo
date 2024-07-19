-- CreateTable
CREATE TABLE "job_states" (
    "job_name" TEXT NOT NULL,
    "last_run" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "job_states_pkey" PRIMARY KEY ("job_name")
);
