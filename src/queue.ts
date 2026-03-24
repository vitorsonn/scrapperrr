import { Queue } from "bullmq";

const connection = {
    host: "localhost",
    port: 6379
};

export const scraperQueue = new Queue("scrapper", {
    connection
}); 