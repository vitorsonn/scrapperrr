import { Queue } from "bullmq";
import { connection } from "./connection"

export const scraperQueue = new Queue("scrapper", {
    connection
});