import axios from "axios";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

const buildBookingFallback = (userFirstName) => {
  return `**How to book a car with UrbanDrive**

Hi ${userFirstName}, here's a quick overview:

1. **Choose your dates & location** - Pick your pickup and return dates.  
   - Select your pickup and drop-off locations.
2. **Browse available cars** - Filter by price, category (SUV, Sedan, Luxury), transmission, and more.  
   - Open a vehicle to see photos, specs, and pricing breakdown.
3. **Customize your booking** - Add insurance coverage and any extras (GPS, child seat, additional driver, etc.).  
   - Review the total price, including taxes and fees.
4. **Enter your details & confirm** - Sign in or create an account.  
   - Confirm your contact details and payment method.
5. **Receive confirmation** - You'll see your booking in **My Bookings** on your dashboard.  
   - A confirmation email with all details is sent to you.

If you tell me your pickup city and dates, I can help you narrow down which vehicle type is best for you.`;
};

const getDomainFallback = (prompt, userFirstName) => {
  const question = (prompt || "").toLowerCase();

  if (question.includes("book")) {
    return buildBookingFallback(userFirstName);
  }

  if (question.includes("cancel")) {
    return `**Cancellation policy (summary)**

- You can cancel most bookings **free of charge up to 24 hours** before pickup.  
- Within 24 hours of pickup, a cancellation fee may apply depending on the vehicle and location.  
- To cancel:
  1. Go to **User Dashboard → My Bookings**.  
  2. Open the booking and click **Cancel booking** (if available).  
  3. You'll see the refund amount and any applicable fees before confirming.

For exact fees on your booking, open the booking details in your dashboard or contact support with your booking ID.`;
  }

  if (
    question.includes("payment") ||
    question.includes("pay") ||
    question.includes("card")
  ) {
    return `**Payments & cards**

- We accept most major credit and debit cards.  
- Your card is normally charged when the booking is confirmed.  
- A **security deposit** may be held on your card at pickup, depending on the vehicle and location.  
- You can update your saved cards under **User Dashboard → Account / Payment methods**.

If you're seeing a payment error, share the exact message and I can help interpret it.`;
  }

  if (
    question.includes("document") ||
    question.includes("license") ||
    question.includes("id")
  ) {
    return `**Documents required to rent a car**

- A valid **driver's license** for the primary driver (and any additional drivers).  
- A **payment card** in the main driver's name.  
- In some locations, a **passport or national ID** may be required, especially for international renters.  

Always bring the same documents you used when booking; staff may refuse the rental if documents don’t match.`;
  }

  return `I couldn't get a detailed answer from the AI service just now, but here are some things I can help with:

- **How to book or modify a reservation** - **Cancellation rules and fees** - **Payments, deposits, and invoices** - **Account or login issues**

Try asking a specific question like: 
- "How do I book a car for this weekend?"  
- "What is your cancellation policy?"  
- "What documents do I need to pick up the car?"`;
};

export const handleChat = catchAsync(async (req, res, next) => {
  const { prompt, chatHistory = [] } = req.body;
  const userFirstName = req.user.firstName || "Customer";

  const AI_API_KEY = process.env.OPENROUTER_API_KEY;

  if (AI_API_KEY) {
    console.log("✅ AI Key Found:", AI_API_KEY.substring(0, 6) + "...");
  } else {
    console.error("❌ AI Key NOT FOUND. Did you restart the server?");
  }

  if (!prompt) {
    return next(new AppError("A prompt is required.", 400));
  }

  if (!AI_API_KEY) {
    return next(
      new AppError("AI service is not configured on the server.", 500)
    );
  }

  const AI_API_URL = "https://openrouter.ai/api/v1/chat/completions";

  try {
    const systemMessage = {
      role: "system",
      content: `You are "UrbanDrive AI", a helpful assistant for a luxury car rental company. 
The user's name is ${userFirstName}.
- Be friendly and conversational.
- **Only greet the user by name in the very first message of the conversation, not in subsequent replies.**
- ALWAYS format your response using GitHub-flavored Markdown.
- Use **bold text** for headings and lists.
- Use bullet points (-) or numbered lists (1.) for steps or features.
- Keep your answers concise and helpful.
- Do NOT include '<s>' or '[OUT]' tags.

- **Handle Your Purpose:** Your primary purpose is to help with car rentals. If the user asks a question unrelated to car rentals, bookings, or company policies (like "what is the day today" or "what is the weather"), you MUST politely decline and guide them back to your purpose.
- **Example of declining:** "I'm sorry, ${userFirstName}, but I can only assist with questions about our car rentals and services. How can I help with your booking today?"`,
    };

    const mappedHistory = chatHistory.map((msg) => ({
      role: msg.from === "ai" ? "assistant" : "user",
      content: msg.text,
    }));

    const payload = {
      model: "mistralai/mistral-7b-instruct:free",

      max_tokens: 2048,
      messages: [
        systemMessage,
        ...mappedHistory,
        { role: "user", content: prompt },
      ],
    };

    const headers = {
      Authorization: `Bearer ${AI_API_KEY}`,
      "Content-Type": "application/json",
    };

    const response = await axios.post(AI_API_URL, payload, { headers });

    if (
      !response.data ||
      !response.data.choices ||
      !response.data.choices[0] ||
      !response.data.choices[0].message
    ) {
      return next(
        new AppError("AI assistant gave an unexpected response.", 500)
      );
    }

    const rawContent = response.data.choices[0].message.content;
    console.log("🔍 AI raw content:", JSON.stringify(rawContent));

    const aiResponse =
      typeof rawContent === "string"
        ? rawContent
        : Array.isArray(rawContent)
          ? rawContent
            .map((part) => (typeof part === "string" ? part : part?.text || ""))
            .join(" ")
          : String(rawContent ?? "");

    let cleanedResponse = aiResponse.replace(/<s>|\[OUT\]/g, "").trim();

    if (!cleanedResponse) {
      cleanedResponse = getDomainFallback(prompt, userFirstName);
    }

    res.status(200).json({
      status: "success",
      data: {
        reply: cleanedResponse,
      },
    });
  } catch (error) {
    console.error("--- FULL OPENROUTER API ERROR ---");
    if (error.response) {
      console.error("Data:", JSON.stringify(error.response.data, null, 2));
      console.error("Status:", error.response.status);
    } else {
      console.error("Error Message:", error.message);
    }
    console.error("--- END OF API ERROR ---");

    const fallback = getDomainFallback(prompt, userFirstName);

    return res.status(200).json({
      status: "success",
      data: {
        reply: fallback,
      },
    });
  }
});
