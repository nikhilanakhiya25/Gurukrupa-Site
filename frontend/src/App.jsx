<div className="page-container">
          <Routes>
            {/* Public */}
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductList />} />

            {/* Auth */}
            <Route path="/login" element={isLoggedIn ? <Navigate to="/" /> : <LoginPage />} />
            <Route path="/signup" element={isLoggedIn ? <Navigate to="/" /> : <Signup />} />

            {/* Cart & Checkout */}
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={isLoggedIn ? <Checkout /> : <Navigate to="/login" />} />
            <Route path="/payment" element={<Payment />} />

            {/* User Order Routes */}
            <Route path="/my-orders" element={<MyOrders />} />
            <Route path="/order-success/:id" element={<OrderSuccess />} />
            <Route path="/track-order/:id" element={<OrderTracking />} />

            {/* Admin Only */}
            <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="products" element={<Products />} />
              <Route path="orders" element={<Orders />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
        </div>

        {/* --- ROUTES --- */}
        <div className="page-container">
          {/* Admin Sidebar - Only for admins */}
          {user?.role?.toLowerCase() === "admin" && <AdminSidebar />}

          <Routes>
            {/* Public */}
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductList />} />

            {/* Auth */}
            <Route path="/login" element={isLoggedIn ? <Navigate to="/" /> : <LoginPage />} />
            <Route path="/signup" element={isLoggedIn ? <Navigate to="/" /> : <Signup />} />

            {/* Cart & Checkout */}
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={isLoggedIn ? <Checkout /> : <Navigate to="/login" />} />
            <Route path="/payment" element={<Payment />} />

            {/* User Order Routes */}
            <Route path="/my-orders" element={<MyOrders />} />
            <Route path="/order-success/:id" element={<OrderSuccess />} />
            <Route path="/track-order/:id" element={<OrderTracking />} />

            {/* Admin Only */}
            <Route path="/admin" element={
              user?.role?.toLowerCase() === "admin" ? <AdminPanel /> : <Navigate to="/" />
            }>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="products" element={<Products />} />
              <Route path="orders" element={<Orders />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
        </div>
