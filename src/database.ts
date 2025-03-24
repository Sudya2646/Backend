import "reflect-metadata"; // Required for TypeORM
import { DataSource } from "typeorm";
import { Product } from "./entities/Product"; // ✅ Ensure correct path

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "gateway01.ap-southeast-1.prod.aws.tidbcloud.com",
  port: 4000,
  username: "vonnB2CeZAEgprf.root",
  password: "FjMpnW4Btv1w6DkR",
  database: "Ecommerce",
  synchronize: true, // ✅ Auto sync schema (use carefully in production)
  logging: true,
  entities: [Product],
  extra: {
    ssl: {
      rejectUnauthorized: true, // ✅ Ensures secure connection
    },
  },
});

// ✅ Initialize connection
AppDataSource.initialize()
  .then(async () => {
    console.log("✅ Successfully connected to MySQL database!");

    // ✅ Run a test query to ensure the connection works
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    console.log("✅ Test query result:", await queryRunner.query("SELECT 1"));
    await queryRunner.release();
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err);
  });
