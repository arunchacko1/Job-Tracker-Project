import { expect, test } from "@playwright/test";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const password = "password123";
const testUser = {
  email: "e2e-user@example.com",
  name: "E2E User"
};

async function resetTestUser() {
  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.deleteMany({
    where: { email: testUser.email }
  });

  await prisma.user.create({
    data: {
      email: testUser.email,
      name: testUser.name,
      passwordHash
    }
  });
}

async function signIn(page: import("@playwright/test").Page) {
  await page.goto("/signin");
  await page.getByLabel("Email").fill(testUser.email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page.getByRole("heading", { name: "Your job search cockpit" })).toBeVisible();
}

function inputDate(daysFromToday: number) {
  const date = new Date();
  date.setDate(date.getDate() + daysFromToday);
  return date.toISOString().slice(0, 10);
}

test.beforeEach(async () => {
  await resetTestUser();
});

test.afterAll(async () => {
  await prisma.user.deleteMany({
    where: { email: testUser.email }
  });
  await prisma.$disconnect();
});

test("protects private pages and handles sign-in states", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/signin/);

  await page.getByLabel("Email").fill(testUser.email);
  await page.getByLabel("Password").fill("wrong-password");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page.getByText("That email and password did not match.")).toBeVisible();

  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page.getByRole("heading", { name: "Your job search cockpit" })).toBeVisible();
});

test("covers application create, edit, search, reminders, archive, and delete", async ({ page }) => {
  const company = `Acme E2E ${Date.now()}`;
  const role = "Product Engineer";

  await signIn(page);

  await test.step("create an application", async () => {
    await page.getByRole("link", { name: "Add application" }).first().click();
    await page.getByLabel("Company").fill(company);
    await page.getByLabel("Role").fill(role);
    await page.getByLabel("Status").selectOption("APPLIED");
    await page.getByLabel("Source").fill("Referral");
    await page.getByLabel("Job URL").fill("https://example.com/product-engineer");
    await page.getByLabel("Location").fill("Remote");
    await page.getByLabel("Salary range").fill("$95k - $120k");
    await page.getByLabel("Date applied").fill(inputDate(-1));
    await page.getByLabel("Follow-up date").fill(inputDate(3));
    await page.getByLabel("Notes").fill("Prepare product thinking examples.");
    await page.getByRole("button", { name: "Create application" }).click();

    await expect(page.getByRole("heading", { name: role })).toBeVisible();
    await expect(page.getByText(company)).toBeVisible();
    await expect(page.locator(".status", { hasText: "Applied" })).toBeVisible();
    await expect(page.getByText("Prepare product thinking examples.")).toBeVisible();
  });

  await test.step("edit the application and write status history", async () => {
    await page.getByRole("link", { name: "Edit" }).click();
    await page.getByLabel("Status").selectOption("INTERVIEWING");
    await page.getByLabel("Notes").fill("Technical screen scheduled.");
    await page.getByRole("button", { name: "Save changes" }).click();

    await expect(page.getByRole("heading", { name: role })).toBeVisible();
    await expect(page.getByText("Interviewing").first()).toBeVisible();
    await expect(page.getByText("Status changed from APPLIED to INTERVIEWING.")).toBeVisible();
    await expect(page.getByText("Technical screen scheduled.")).toBeVisible();
  });

  await test.step("search and filter applications", async () => {
    await page.getByRole("link", { name: "Applications" }).click();
    await page.getByLabel("Search").fill(company);
    await page.getByLabel("Status").selectOption("INTERVIEWING");
    await page.getByRole("button", { name: "Filter" }).click();

    await expect(page.getByText(company)).toBeVisible();
    await expect(page.getByText(role)).toBeVisible();
  });

  await test.step("show the application in reminders", async () => {
    await page.getByRole("link", { name: "Reminders" }).click();

    await expect(page.getByRole("heading", { name: "Follow-up queue" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Due soon" })).toBeVisible();
    await expect(page.getByText(company)).toBeVisible();
  });

  await test.step("archive the application", async () => {
    await page.getByRole("link", { name: "View" }).click();
    await page.getByRole("button", { name: "Archive" }).click();

    await expect(page.getByText("Archived").first()).toBeVisible();
  });

  await test.step("delete the application", async () => {
    await page.getByRole("button", { name: "Delete" }).click();
    await expect(page.getByRole("heading", { name: "All opportunities" })).toBeVisible();

    await page.getByLabel("Search").fill(company);
    await page.getByRole("button", { name: "Filter" }).click();
    await expect(page.getByText(company)).toHaveCount(0);
  });
});
