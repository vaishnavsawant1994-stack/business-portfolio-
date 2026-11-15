import { test, expect } from "@playwright/test";
const routes=["/","/work","/services","/pricing","/about","/journal","/contact","/privacy",
"/work/haku","/work/pott-festival","/work/elia-studio","/work/fruta","/work/quarto","/work/loop",
"/journal/how-we-plan-a-website-before-designing-a-single-page",
"/journal/choosing-brand-colors-your-team-can-actually-use",
"/journal/what-to-prepare-before-you-hire-a-design-studio"];
for(const route of routes){test("route "+route,async({page})=>{const response=await page.goto(route);expect(response?.status()).toBe(200);await expect(page.locator("h1").first()).toBeVisible();await expect(page.locator("footer")).toBeVisible()})}
test("service tabs switch content",async({page})=>{await page.goto("/services");await page.getByRole("tab",{name:/Website design/}).click();await expect(page.getByRole("tabpanel")).toContainText("Website design");await expect(page.getByRole("tab",{name:/Website design/})).toHaveAttribute("aria-selected","true")});
test("mobile navigation opens and routes",async({page})=>{await page.setViewportSize({width:375,height:812});await page.goto("/");await page.getByRole("button",{name:"Toggle menu"}).click();await page.getByRole("navigation",{name:"Mobile navigation"}).getByRole("link",{name:"Pricing"}).click();await expect(page).toHaveURL(/\/pricing$/)});
test("contact validation does not fake send",async({page})=>{await page.goto("/contact");await page.getByRole("button",{name:/Send enquiry/}).click();await expect(page.locator("#contact-name")).toBeVisible();await expect(page.locator("#form-status")).toContainText("required")});
for(const width of [320,375,430,768,1024,1440,1920,2560]){test("horizontal overflow "+width,async({page})=>{await page.setViewportSize({width,height:900});await page.goto("/");await expect(page.locator("h1")).toBeVisible();const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+2);expect(overflow).toBeFalsy()})}
test("browser history works",async({page})=>{await page.goto("/");await page.getByRole("navigation",{name:"Main navigation"}).getByRole("link",{name:"Work"}).click();await page.goBack();await expect(page).toHaveURL(/\/$/)});
