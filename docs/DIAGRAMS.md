# Ecommerce Shop - System Diagrams

## 1. USE CASE DIAGRAM

```mermaid
flowchart TB
    subgraph Actors
        Customer((Customer))
        Admin((Admin))
        AI((AI System))
        SePay((SePay Gateway))
    end

    subgraph "Authentication System"
        UC1[Register]
        UC2[Login]
        UC3[Logout]
        UC4[Manage Profile]
    end

    subgraph "Shopping System"
        UC5[Browse Products]
        UC6[Search Products]
        UC7[View Product Detail]
        UC8[Add to Cart]
        UC9[Manage Cart]
        UC10[Add to Wishlist]
    end

    subgraph "Checkout System"
        UC11[Checkout]
        UC12[Select Payment Method]
        UC13[Pay with COD]
        UC14[Pay with SePay]
        UC15[View Order History]
        UC16[Track Order]
    end

    subgraph "Recipe System"
        UC17[Browse Recipes]
        UC18[View Recipe Detail]
        UC19[Add Recipe Ingredients to Cart]
        UC20[Get AI Recipe Suggestions]
    end

    subgraph "AI Chatbot System"
        UC21[Chat with AI Assistant]
        UC22[Get Product Recommendations]
        UC23[Analyze Cart Context]
    end

    subgraph "Admin System"
        UC24[Manage Products]
        UC25[Manage Categories]
        UC26[Manage Recipes]
        UC27[Manage Orders]
        UC28[Manage Users]
        UC29[View Dashboard Analytics]
    end

    %% Customer connections
    Customer --> UC1
    Customer --> UC2
    Customer --> UC3
    Customer --> UC4
    Customer --> UC5
    Customer --> UC6
    Customer --> UC7
    Customer --> UC8
    Customer --> UC9
    Customer --> UC10
    Customer --> UC11
    Customer --> UC15
    Customer --> UC16
    Customer --> UC17
    Customer --> UC18
    Customer --> UC19
    Customer --> UC21

    %% Admin connections
    Admin --> UC2
    Admin --> UC24
    Admin --> UC25
    Admin --> UC26
    Admin --> UC27
    Admin --> UC28
    Admin --> UC29

    %% AI connections
    AI --> UC20
    AI --> UC22
    AI --> UC23

    %% SePay connections
    UC14 --> SePay

    %% Include relationships
    UC11 --> UC12
    UC12 --> UC13
    UC12 --> UC14
    UC21 --> UC22
    UC21 --> UC23
```

---

## 2. ACTIVITY DIAGRAM - Checkout Flow

```mermaid
flowchart TD
    Start([Start Checkout]) --> CheckCart{Cart Empty?}
    CheckCart -->|Yes| RedirectShop[Redirect to Shop]
    RedirectShop --> End1([End])

    CheckCart -->|No| CheckAuth{User Logged In?}
    CheckAuth -->|No| ShowLogin[Show Login Form]
    ShowLogin --> Login[User Login]
    Login --> CheckAuth

    CheckAuth -->|Yes| ShowShipping[Display Shipping Form]
    ShowShipping --> EnterAddress[Enter/Select Address]
    EnterAddress --> ValidateAddress{Address Valid?}
    ValidateAddress -->|No| ShowError1[Show Validation Error]
    ShowError1 --> EnterAddress

    ValidateAddress -->|Yes| ShowPayment[Display Payment Options]
    ShowPayment --> SelectPayment{Select Payment}

    SelectPayment -->|COD| CreateOrderCOD[Create Order - COD]
    CreateOrderCOD --> UpdateStock1[Update Stock Quantity]
    UpdateStock1 --> SendEmailCOD[Send Confirmation Email]
    SendEmailCOD --> ShowSuccessCOD[Show Success Page]
    ShowSuccessCOD --> End2([End])

    SelectPayment -->|SePay| CreateOrderSePay[Create Order - Pending]
    CreateOrderSePay --> GenerateQR[Generate SePay QR Code]
    GenerateQR --> ShowQRModal[Display QR Modal]
    ShowQRModal --> WaitPayment[Wait for Payment]

    WaitPayment --> CheckWebhook{Webhook Received?}
    CheckWebhook -->|No| CheckTimeout{Timeout?}
    CheckTimeout -->|No| WaitPayment
    CheckTimeout -->|Yes| CancelOrder[Cancel Order]
    CancelOrder --> ShowError2[Show Payment Failed]
    ShowError2 --> End3([End])

    CheckWebhook -->|Yes| VerifyPayment{Payment Verified?}
    VerifyPayment -->|No| ShowError2
    VerifyPayment -->|Yes| UpdateOrderPaid[Update Order Status: PAID]
    UpdateOrderPaid --> UpdateStock2[Update Stock Quantity]
    UpdateStock2 --> SendEmailSePay[Send Confirmation Email]
    SendEmailSePay --> EmitSocket[Emit Socket Event]
    EmitSocket --> ShowSuccessSePay[Redirect to Success Page]
    ShowSuccessSePay --> End4([End])
```

---

## 3. ACTIVITY DIAGRAM - AI Recipe Suggestion

```mermaid
flowchart TD
    Start([User Opens Recipe Hub]) --> FetchRecipes[Fetch All Recipes]
    FetchRecipes --> FetchProducts[Fetch Products with Stock]
    FetchProducts --> ProcessRecipes[Process Each Recipe]

    ProcessRecipes --> CheckIngredients{All Ingredients\nIn Stock?}
    CheckIngredients -->|Yes| MarkAvailable[Mark Recipe as Available]
    CheckIngredients -->|No| CheckOptional{Only Optional\nMissing?}
    CheckOptional -->|Yes| MarkPartial[Mark as Partially Available]
    CheckOptional -->|No| MarkUnavailable[Mark as Unavailable]

    MarkAvailable --> CalculateCost[Calculate Total Cost]
    MarkPartial --> CalculateCost
    MarkUnavailable --> NextRecipe{More Recipes?}

    CalculateCost --> NextRecipe
    NextRecipe -->|Yes| ProcessRecipes
    NextRecipe -->|No| SortRecipes[Sort by Availability & Cost]

    SortRecipes --> DisplayRecipes[Display Recipe Grid]
    DisplayRecipes --> UserSelect{User Selects Recipe?}

    UserSelect -->|Yes| ShowDetail[Show Recipe Detail]
    ShowDetail --> ShowIngredients[List Ingredients with Stock Status]
    ShowIngredients --> UserAction{User Action?}

    UserAction -->|Add All to Cart| AddToCart[Add Available Ingredients to Cart]
    AddToCart --> ShowCart[Show Cart Summary]
    ShowCart --> End1([End])

    UserAction -->|Back| DisplayRecipes
    UserSelect -->|No| End2([End])
```

---

## 4. SEQUENCE DIAGRAM - User Authentication

```mermaid
sequenceDiagram
    autonumber
    participant U as User
    participant FE as Frontend
    participant BE as Backend API
    participant DB as MongoDB
    participant JWT as JWT Service

    rect rgb(200, 230, 200)
        Note over U,JWT: Registration Flow
        U->>FE: Fill registration form
        FE->>FE: Validate input (Zod)
        FE->>BE: POST /api/auth/register
        BE->>DB: Check email exists
        DB-->>BE: Email status
        alt Email exists
            BE-->>FE: 400 Email already registered
            FE-->>U: Show error message
        else Email available
            BE->>BE: Hash password (bcrypt)
            BE->>DB: Create user document
            DB-->>BE: User created
            BE->>JWT: Generate token
            JWT-->>BE: JWT token
            BE-->>FE: 201 {user, token}
            FE->>FE: Store token in localStorage
            FE->>FE: Update authStore
            FE-->>U: Redirect to homepage
        end
    end

    rect rgb(200, 200, 230)
        Note over U,JWT: Login Flow
        U->>FE: Enter credentials
        FE->>BE: POST /api/auth/login
        BE->>DB: Find user by email
        DB-->>BE: User document
        alt User not found
            BE-->>FE: 401 Invalid credentials
            FE-->>U: Show error
        else User found
            BE->>BE: Compare password (bcrypt)
            alt Password invalid
                BE-->>FE: 401 Invalid credentials
                FE-->>U: Show error
            else Password valid
                BE->>JWT: Generate token
                JWT-->>BE: JWT token
                BE-->>FE: 200 {user, token}
                FE->>FE: Store token
                FE->>FE: Update authStore
                FE-->>U: Redirect to dashboard
            end
        end
    end
```

---

## 5. SEQUENCE DIAGRAM - SePay Payment Flow

```mermaid
sequenceDiagram
    autonumber
    participant U as User
    participant FE as Frontend
    participant BE as Backend API
    participant DB as MongoDB
    participant SP as SePay Gateway
    participant WS as WebSocket

    U->>FE: Click "Pay with SePay"
    FE->>BE: POST /api/orders (paymentMethod: sepay)

    BE->>BE: Validate cart items
    BE->>DB: Check stock availability
    DB-->>BE: Stock OK

    BE->>BE: Generate orderNumber (DH20260124001)
    BE->>DB: Create order (status: pending, payment: pending)
    DB-->>BE: Order created

    BE->>BE: Generate SePay memo (DH{orderId})
    BE-->>FE: {order, qrCodeUrl, memo, amount}

    FE->>FE: Show QR Code Modal
    FE->>WS: Join room: order-{orderId}
    FE-->>U: Display QR + "Waiting for payment..."

    rect rgb(255, 230, 200)
        Note over U,SP: User makes bank transfer
        U->>SP: Scan QR & Transfer money
        SP->>SP: Process transaction
        SP->>BE: POST /api/webhooks/sepay (webhook)
    end

    BE->>BE: Verify webhook signature
    BE->>BE: Parse memo -> Extract orderId
    BE->>DB: Find order by memo
    DB-->>BE: Order found

    BE->>BE: Verify amount matches
    alt Amount mismatch
        BE->>DB: Update order (payment: failed)
        BE-->>SP: 200 OK (logged)
    else Amount matches
        BE->>DB: Update order (payment: paid, status: confirmed)
        DB-->>BE: Order updated

        BE->>DB: Decrease stock quantities
        DB-->>BE: Stock updated

        BE->>WS: Emit "payment-success" to room
        WS-->>FE: payment-success event

        BE-->>SP: 200 OK
    end

    FE->>FE: Close QR Modal
    FE-->>U: Redirect to Success Page
    FE->>BE: GET /api/orders/{orderNumber}
    BE->>DB: Find order with items
    DB-->>BE: Order details
    BE-->>FE: Order data
    FE-->>U: Display order confirmation
```

---

## 6. SEQUENCE DIAGRAM - AI Chatbot Interaction

```mermaid
sequenceDiagram
    autonumber
    participant U as User
    participant FE as Frontend
    participant CS as Cart Store
    participant BE as Backend API
    participant LC as LangChain
    participant AI as Claude API
    participant DB as MongoDB

    U->>FE: Open chatbot widget
    FE->>FE: Generate sessionId
    FE->>BE: GET /api/chat/history/{sessionId}
    BE->>DB: Fetch chat messages
    DB-->>BE: Messages array
    BE-->>FE: Chat history
    FE-->>U: Display chat history

    U->>FE: Type message: "Tôi mệt quá, muốn nấu gì đó nhanh"
    FE->>CS: Get current cart items
    CS-->>FE: Cart items array

    FE->>BE: POST /api/chat/message
    Note right of FE: {message, sessionId, cartContext}

    BE->>DB: Save user message
    DB-->>BE: Message saved

    BE->>BE: Analyze sentiment keywords
    Note right of BE: Detected: "mệt" -> tired sentiment

    BE->>DB: Fetch available recipes (quick cook)
    Note right of BE: Filter: cookTime + prepTime < 30min
    DB-->>BE: Quick recipes list

    BE->>DB: Fetch products in cart context
    DB-->>BE: Related products

    BE->>LC: Build prompt with context
    Note right of LC: System: Recipe assistant<br/>Context: Cart items, sentiment<br/>Available: Quick recipes

    LC->>AI: Send prompt to Claude
    AI-->>LC: AI response

    LC-->>BE: Parsed response with suggestions

    BE->>DB: Save assistant message
    DB-->>BE: Message saved

    BE-->>FE: {response, suggestions: [...]}

    FE->>FE: Update chat UI
    FE->>FE: Display recipe cards
    FE-->>U: Show: "Tôi hiểu bạn đang mệt! Đây là vài món nấu nhanh dưới 30 phút..."

    opt User clicks recipe suggestion
        U->>FE: Click "Thêm vào giỏ"
        FE->>CS: Add recipe ingredients to cart
        CS-->>FE: Cart updated
        FE-->>U: Show toast "Đã thêm nguyên liệu"
    end
```

---

## 7. CLASS DIAGRAM

```mermaid
classDiagram
    class User {
        +ObjectId _id
        +String email
        +String password
        +String name
        +String phone
        +String avatar
        +Enum role
        +Address[] addresses
        +ObjectId[] wishlist
        +Boolean isActive
        +Date createdAt
        +Date updatedAt
        +comparePassword(candidatePassword) Boolean
    }

    class Address {
        +String label
        +String fullName
        +String phone
        +String province
        +String district
        +String ward
        +String street
        +Boolean isDefault
    }

    class Category {
        +ObjectId _id
        +String name
        +String slug
        +String description
        +String image
        +ObjectId parent
        +Boolean isActive
        +Number order
    }

    class Product {
        +ObjectId _id
        +String name
        +String slug
        +String description
        +String shortDescription
        +Number price
        +Number comparePrice
        +String[] images
        +ObjectId category
        +String[] tags
        +Number stockQuantity
        +String unit
        +String sku
        +Boolean isActive
        +Boolean isFeatured
        +NutritionInfo nutritionInfo
        +Number[] embedding
        +Number viewCount
        +Number soldCount
    }

    class NutritionInfo {
        +Number calories
        +Number protein
        +Number carbs
        +Number fat
        +Number fiber
    }

    class Recipe {
        +ObjectId _id
        +String name
        +String slug
        +String description
        +String image
        +String video
        +Number cookTime
        +Number prepTime
        +Number servings
        +Enum difficulty
        +RecipeIngredient[] ingredients
        +RecipeStep[] steps
        +String[] tags
        +Boolean isActive
        +Number[] embedding
        +Number viewCount
        +totalTime() Number
    }

    class RecipeIngredient {
        +ObjectId product
        +Number quantity
        +String unit
        +Boolean isOptional
    }

    class RecipeStep {
        +Number order
        +String instruction
        +String image
        +Number duration
    }

    class Order {
        +ObjectId _id
        +String orderNumber
        +ObjectId user
        +OrderItem[] items
        +OrderAddress shippingAddress
        +Enum paymentMethod
        +Enum paymentStatus
        +Enum orderStatus
        +Number subtotal
        +Number shippingFee
        +Number discount
        +Number total
        +String note
        +String sepayTransactionId
        +StatusHistory[] statusHistory
        +generateOrderNumber() String
    }

    class OrderItem {
        +ObjectId product
        +String name
        +Number price
        +Number quantity
        +String image
    }

    class StatusHistory {
        +String status
        +String note
        +Date createdAt
    }

    class ChatMessage {
        +ObjectId _id
        +String sessionId
        +ObjectId user
        +Enum role
        +String content
        +ChatContext context
        +Date createdAt
    }

    class ChatContext {
        +CartItem[] cartItems
        +Enum sentiment
        +String intent
    }

    %% Relationships
    User "1" *-- "*" Address : has
    User "1" -- "*" Order : places
    User "1" -- "*" ChatMessage : sends
    User "*" -- "*" Product : wishlists

    Category "1" -- "*" Product : contains
    Category "0..1" -- "*" Category : parent

    Product "1" *-- "0..1" NutritionInfo : has
    Product "*" -- "*" Recipe : used in

    Recipe "1" *-- "*" RecipeIngredient : contains
    Recipe "1" *-- "*" RecipeStep : has
    RecipeIngredient "*" -- "1" Product : references

    Order "1" *-- "*" OrderItem : contains
    Order "1" *-- "1" Address : ships to
    Order "1" *-- "*" StatusHistory : tracks
    OrderItem "*" -- "1" Product : references

    ChatMessage "1" *-- "0..1" ChatContext : has
```

---

## 8. ENTITY RELATIONSHIP DIAGRAM (MongoDB Schema)

```mermaid
erDiagram
    USERS {
        ObjectId _id PK
        String email UK
        String password
        String name
        String phone
        String avatar
        Enum role "customer|admin|superadmin"
        Array addresses "embedded"
        Array wishlist "ObjectId[]"
        Boolean isActive
        Date createdAt
        Date updatedAt
    }

    CATEGORIES {
        ObjectId _id PK
        String name
        String slug UK
        String description
        String image
        ObjectId parent FK
        Boolean isActive
        Number order
        Date createdAt
        Date updatedAt
    }

    PRODUCTS {
        ObjectId _id PK
        String name
        String slug UK
        String description
        String shortDescription
        Number price
        Number comparePrice
        Array images "String[]"
        ObjectId category FK
        Array tags "String[]"
        Number stockQuantity
        String unit
        String sku UK
        Boolean isActive
        Boolean isFeatured
        Object nutritionInfo "embedded"
        Array embedding "Number[]"
        Number viewCount
        Number soldCount
        Date createdAt
        Date updatedAt
    }

    RECIPES {
        ObjectId _id PK
        String name
        String slug UK
        String description
        String image
        String video
        Number cookTime
        Number prepTime
        Number servings
        Enum difficulty "easy|medium|hard"
        Array ingredients "embedded"
        Array steps "embedded"
        Array tags "String[]"
        Boolean isActive
        Array embedding "Number[]"
        Number viewCount
        Date createdAt
        Date updatedAt
    }

    ORDERS {
        ObjectId _id PK
        String orderNumber UK
        ObjectId user FK
        Array items "embedded"
        Object shippingAddress "embedded"
        Enum paymentMethod "cod|sepay"
        Enum paymentStatus "pending|paid|failed|refunded"
        Enum orderStatus "pending|confirmed|processing|shipping|delivered|cancelled"
        Number subtotal
        Number shippingFee
        Number discount
        Number total
        String note
        String sepayTransactionId
        Array statusHistory "embedded"
        Date createdAt
        Date updatedAt
    }

    CHATMESSAGES {
        ObjectId _id PK
        String sessionId
        ObjectId user FK
        Enum role "user|assistant"
        String content
        Object context "embedded"
        Date createdAt
    }

    %% Relationships
    USERS ||--o{ ORDERS : "places"
    USERS ||--o{ CHATMESSAGES : "sends"
    USERS }o--o{ PRODUCTS : "wishlists"

    CATEGORIES ||--o{ PRODUCTS : "contains"
    CATEGORIES ||--o{ CATEGORIES : "parent of"

    PRODUCTS }o--o{ RECIPES : "ingredient of"

    ORDERS }o--|| USERS : "belongs to"
```

---

## 9. STATE DIAGRAM - Order Status

```mermaid
stateDiagram-v2
    [*] --> Pending : Order Created

    Pending --> Confirmed : Admin Confirms
    Pending --> Cancelled : Customer Cancels
    Pending --> Cancelled : Payment Timeout (SePay)

    Confirmed --> Processing : Start Preparing
    Confirmed --> Cancelled : Admin Cancels

    Processing --> Shipping : Hand to Carrier
    Processing --> Cancelled : Admin Cancels

    Shipping --> Delivered : Customer Received
    Shipping --> Cancelled : Delivery Failed

    Delivered --> [*]
    Cancelled --> [*]

    note right of Pending
        Initial state after checkout
        Waiting for payment (SePay)
        or confirmation (COD)
    end note

    note right of Confirmed
        Payment verified (SePay)
        or COD order accepted
    end note

    note right of Processing
        Order being prepared
        Items being packed
    end note

    note right of Shipping
        Handed to delivery service
        Tracking available
    end note
```

---

## 10. STATE DIAGRAM - Payment Status

```mermaid
stateDiagram-v2
    [*] --> Pending : Order Created

    state COD_Flow {
        Pending --> Paid : Delivered & Cash Collected
    }

    state SePay_Flow {
        Pending --> Paid : Webhook Received & Verified
        Pending --> Failed : Payment Timeout
        Pending --> Failed : Amount Mismatch
    }

    Paid --> Refunded : Admin Processes Refund
    Failed --> Pending : Retry Payment

    Paid --> [*]
    Refunded --> [*]

    note right of Pending
        Waiting for payment
        COD: Until delivery
        SePay: Until webhook
    end note

    note right of Paid
        Payment confirmed
        Stock decremented
        Email sent
    end note

    note right of Failed
        Payment unsuccessful
        Stock restored
        User notified
    end note
```

---

## 11. COMPONENT DIAGRAM - Frontend Architecture

```mermaid
flowchart TB
    subgraph "React Application"
        subgraph "App Layer"
            App[App.tsx]
            Router[React Router]
        end

        subgraph "Layout Components"
            MainLayout[MainLayout]
            AdminLayout[AdminLayout]
            Header[Header]
            Footer[Footer]
        end

        subgraph "Feature Modules"
            subgraph "Shop"
                HomePage[HomePage]
                ShopPage[ShopPage]
                ProductDetail[ProductDetailPage]
            end

            subgraph "Cart & Checkout"
                CartPage[CartPage]
                CheckoutPage[CheckoutPage]
            end

            subgraph "Auth"
                LoginPage[LoginPage]
                RegisterPage[RegisterPage]
            end

            subgraph "Recipe"
                RecipeHub[RecipeHubPage]
                RecipeDetail[RecipeDetailPage]
            end

            subgraph "Admin"
                Dashboard[DashboardPage]
                ProductManager[ProductManager]
                OrderManager[OrderManager]
            end

            subgraph "Chatbot"
                ChatWidget[ChatWidget]
                ChatBubble[ChatBubble]
            end
        end

        subgraph "State Management"
            AuthStore[(authStore)]
            CartStore[(cartStore)]
            ReactQuery[(React Query)]
        end

        subgraph "Shared Components"
            UI[UI Components]
            Hooks[Custom Hooks]
            Utils[Utilities]
        end
    end

    subgraph "External"
        API[Backend API]
        Socket[Socket.IO]
    end

    App --> Router
    Router --> MainLayout
    Router --> AdminLayout

    MainLayout --> Header
    MainLayout --> Footer
    MainLayout --> Shop
    MainLayout --> Cart & Checkout
    MainLayout --> Recipe
    MainLayout --> ChatWidget

    AdminLayout --> Admin

    Shop --> UI
    Cart & Checkout --> CartStore
    Auth --> AuthStore

    ReactQuery --> API
    ChatWidget --> Socket
```

---

## 12. DEPLOYMENT DIAGRAM

```mermaid
flowchart TB
    subgraph "Client Side"
        Browser[Web Browser]
        Mobile[Mobile Browser]
    end

    subgraph "CDN Layer"
        Vercel[Vercel / Netlify]
        Cloudinary[Cloudinary CDN]
    end

    subgraph "Application Layer"
        subgraph "Frontend Container"
            React[React App]
            Vite[Vite Build]
        end

        subgraph "Backend Container"
            Express[Express Server]
            SocketIO[Socket.IO]
        end
    end

    subgraph "Service Layer"
        subgraph "Database"
            MongoDB[(MongoDB Atlas)]
            VectorSearch[Vector Search]
        end

        subgraph "AI Services"
            LangChain[LangChain.js]
            Claude[Claude API]
        end

        subgraph "Payment"
            SePay[SePay Gateway]
        end

        subgraph "Email"
            SMTP[SMTP Service]
        end
    end

    Browser --> Vercel
    Mobile --> Vercel

    Vercel --> React
    React --> Express

    Cloudinary --> Browser

    Express --> MongoDB
    Express --> VectorSearch
    Express --> LangChain
    LangChain --> Claude
    Express --> SePay
    Express --> SMTP

    SocketIO --> Browser
    SePay -->|Webhook| Express
```

---

## Summary

| Diagram | Purpose |
|---------|---------|
| Use Case | Shows all system actors and their interactions |
| Activity (Checkout) | Detailed checkout flow with COD and SePay |
| Activity (Recipe AI) | AI recipe suggestion logic |
| Sequence (Auth) | Registration and login flow |
| Sequence (SePay) | Real-time payment processing |
| Sequence (Chatbot) | AI chatbot interaction flow |
| Class Diagram | Object-oriented design of entities |
| ERD | MongoDB schema relationships |
| State (Order) | Order status transitions |
| State (Payment) | Payment status transitions |
| Component | Frontend architecture |
| Deployment | System deployment topology |
