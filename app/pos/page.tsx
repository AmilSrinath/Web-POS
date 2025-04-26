"use client"

import { useState, useRef, useEffect, type KeyboardEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  AlertCircle,
  Check,
  CreditCard,
  DollarSign,
  Minus,
  Plus,
  ScanBarcodeIcon as BarcodeScan,
  Search,
  ShoppingCart,
  Trash2,
  User,
  Calendar,
} from "lucide-react"

// Update the product data structure to remove batch barcodes
const products = [
  {
    id: "1",
    name: "Apples",
    unit: "kg",
    category: "Fruits",
    barcode: "2000000001",
    imageUrl: "/single-red-apple.png",
    batches: [
      { id: "1-A", batchNumber: "A001", expiryDate: "2023-06-15", quantity: 50, price: 2.99 },
      { id: "1-B", batchNumber: "A002", expiryDate: "2023-06-20", quantity: 75, price: 3.29 },
    ],
  },
  {
    id: "2",
    name: "Milk",
    unit: "liter",
    category: "Dairy",
    barcode: "4796026408192",
    imageUrl: "/classic-milk-carton.png",
    batches: [{ id: "2-A", batchNumber: "M101", expiryDate: "2023-05-10", quantity: 30, price: 3.49 }],
  },
  {
    id: "3",
    name: "Bread",
    unit: "piece",
    category: "Bakery",
    barcode: "2000000003",
    imageUrl: "/golden-crust-loaf.png",
    batches: [
      { id: "3-A", batchNumber: "B201", expiryDate: "2023-05-05", quantity: 20, price: 2.29 },
      { id: "3-B", batchNumber: "B202", expiryDate: "2023-05-07", quantity: 25, price: 2.19 },
    ],
  },
  {
    id: "4",
    name: "Chicken Breast",
    unit: "kg",
    category: "Meat",
    barcode: "2000000004",
    imageUrl: "/pan-seared-chicken.png",
    batches: [
      { id: "4-A", batchNumber: "C301", expiryDate: "2023-05-08", quantity: 15, price: 8.99 },
      { id: "4-B", batchNumber: "C302", expiryDate: "2023-05-12", quantity: 20, price: 9.49 },
    ],
  },
  {
    id: "5",
    name: "Red Wine",
    unit: "bottle",
    category: "Beverages",
    barcode: "2000000005",
    imageUrl: "/elegant-red-wine.png",
    batches: [{ id: "5-A", batchNumber: "W401", expiryDate: "2024-12-31", quantity: 10, price: 12.99 }],
  },
  {
    id: "6",
    name: "Cheese",
    unit: "kg",
    category: "Dairy",
    barcode: "2000000006",
    imageUrl: "/cheese-board-variety.png",
    batches: [
      { id: "6-A", batchNumber: "CH501", expiryDate: "2023-06-01", quantity: 12, price: 5.99 },
      { id: "6-B", batchNumber: "CH502", expiryDate: "2023-06-15", quantity: 18, price: 6.49 },
    ],
  },
  {
    id: "7",
    name: "Tomatoes",
    unit: "kg",
    category: "Vegetables",
    barcode: "2000000007",
    imageUrl: "/ripe-red-tomatoes.png",
    batches: [
      { id: "7-A", batchNumber: "T601", expiryDate: "2023-05-10", quantity: 30, price: 3.99 },
      { id: "7-B", batchNumber: "T602", expiryDate: "2023-05-15", quantity: 40, price: 3.49 },
    ],
  },
  {
    id: "8",
    name: "Orange Juice",
    unit: "liter",
    category: "Beverages",
    barcode: "2000000008",
    imageUrl: "/refreshing-orange-juice.png",
    batches: [{ id: "8-A", batchNumber: "OJ701", expiryDate: "2023-05-20", quantity: 25, price: 4.49 }],
  },
  {
    id: "9",
    name: "Chocolate Bar",
    unit: "piece",
    category: "Snacks",
    barcode: "2000000009",
    imageUrl: "/decadent-chocolate-bar.png",
    batches: [{ id: "9-A", batchNumber: "CB801", expiryDate: "2023-08-15", quantity: 50, price: 1.99 }],
  },
  {
    id: "10",
    name: "Bananas",
    unit: "kg",
    category: "Fruits",
    barcode: "2000000010",
    imageUrl: "/bunch-of-bananas.png",
    batches: [
      { id: "10-A", batchNumber: "BN901", expiryDate: "2023-05-07", quantity: 40, price: 1.49 },
      { id: "10-B", batchNumber: "BN902", expiryDate: "2023-05-10", quantity: 60, price: 1.29 },
    ],
  },
  {
    id: "11",
    name: "Coffee Beans",
    unit: "kg",
    category: "Beverages",
    barcode: "2000000011",
    imageUrl: "/roasted-coffee-pile.png",
    batches: [{ id: "11-A", batchNumber: "CF101", expiryDate: "2023-12-31", quantity: 15, price: 9.99 }],
  },
  {
    id: "12",
    name: "Yogurt",
    unit: "piece",
    category: "Dairy",
    barcode: "2000000012",
    imageUrl: "/creamy-yogurt-with-berries.png",
    batches: [
      { id: "12-A", batchNumber: "YG111", expiryDate: "2023-05-15", quantity: 30, price: 2.49 },
      { id: "12-B", batchNumber: "YG112", expiryDate: "2023-05-20", quantity: 45, price: 2.29 },
    ],
  },
]

// Sample customer data
const customers = [
  { id: "1", name: "John Doe", phone: "555-1234" },
  { id: "2", name: "Jane Smith", phone: "555-5678" },
  { id: "3", name: "Bob Johnson", phone: "555-9012" },
]

export default function POSPage() {
  const [cart, setCart] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [barcodeInput, setBarcodeInput] = useState("")
  const [customerDialogOpen, setCustomerDialogOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState("cash")
  const [quantityDialogOpen, setQuantityDialogOpen] = useState(false)
  const [batchDialogOpen, setBatchDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [selectedBatch, setSelectedBatch] = useState(null)
  const [quantity, setQuantity] = useState("1")
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(0)
  const [barcodeAssignDialogOpen, setBarcodeAssignDialogOpen] = useState(false)
  const [productWithoutBarcode, setProductWithoutBarcode] = useState(null)
  const searchRef = useRef(null)
  const searchInputRef = useRef(null)

  // Add a ref array to track suggestion elements
  const suggestionRefs = useRef([])

  // Add a ref for the barcode input
  const barcodeInputRef = useRef(null)

  // Add a state to track the selected batch index
  const [selectedBatchIndex, setSelectedBatchIndex] = useState(0)

  // Add a global barcode buffer and timer at the top of the component, after the useState declarations
  const [barcodeBuffer, setBarcodeBuffer] = useState("")
  const [lastKeyTime, setLastKeyTime] = useState(0)
  const barcodeTimeoutRef = useRef(null)

  // Filter products based on search term
  const filteredProducts = products.filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()))

  // Reset selected suggestion index when filtered products change
  useEffect(() => {
    setSelectedSuggestionIndex(0)
    // Reset the refs array to match the new filtered products length
    suggestionRefs.current = Array(filteredProducts.length).fill(null)
  }, [filteredProducts.length])

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Add this useEffect to focus the barcode input when the page loads
  useEffect(() => {
    // Focus the barcode input when the component mounts
    if (barcodeInputRef.current) {
      barcodeInputRef.current.focus()
    }
  }, [])

  // Clear error message after 5 seconds
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage("")
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [errorMessage])

  // Function to handle product selection and determine if batch selection is needed
  const handleProductSelection = (product) => {
    setSelectedProduct(product)

    // Check if the product has only one batch
    if (product.batches.length === 1) {
      // If only one batch, select it automatically and go to quantity dialog
      setSelectedBatch(product.batches[0])

      // Set default quantity based on unit type
      if (product.unit === "piece") {
        setQuantity("1")
      } else {
        setQuantity("1")
      }

      // Open quantity dialog directly
      setQuantityDialogOpen(true)
    } else {
      // If multiple batches, open batch selection dialog
      setBatchDialogOpen(true)
    }
  }

  const addToCart = (product, batch, qty) => {
    const quantityValue = Number.parseFloat(qty)
    if (isNaN(quantityValue) || quantityValue <= 0) return

    // Create a unique identifier for this product+batch combination
    const cartItemId = `${product.id}-${batch.id}`

    const existingItemIndex = cart.findIndex((item) => item.cartItemId === cartItemId)

    if (existingItemIndex >= 0) {
      const updatedCart = [...cart]
      updatedCart[existingItemIndex].quantity += quantityValue
      setCart(updatedCart)
    } else {
      setCart([
        ...cart,
        {
          cartItemId,
          id: product.id,
          name: product.name,
          price: batch.price, // Use batch price instead of product price
          unit: product.unit,
          batch,
          quantity: quantityValue,
        },
      ])
    }

    // Show brief success message
    setSuccessMessage(`Added: ${product.name} (Batch ${batch.batchNumber}) at $${batch.price.toFixed(2)}`)
    setTimeout(() => setSuccessMessage(""), 3000)

    // Focus back on barcode input after adding to cart
    if (barcodeInputRef.current) {
      barcodeInputRef.current.focus()
    }
  }

  const removeFromCart = (cartItemId) => {
    setCart(cart.filter((item) => item.cartItemId !== cartItemId))

    // Focus back on barcode input after removing item
    if (barcodeInputRef.current) {
      barcodeInputRef.current.focus()
    }
  }

  const updateQuantity = (cartItemId, newQuantity) => {
    const quantityValue = Number.parseFloat(newQuantity)
    if (isNaN(quantityValue) || quantityValue <= 0) return

    setCart(cart.map((item) => (item.cartItemId === cartItemId ? { ...item, quantity: quantityValue } : item)))
  }

  const incrementQuantity = (cartItemId) => {
    setCart(
      cart.map((item) => {
        if (item.cartItemId === cartItemId) {
          const step = item.unit === "piece" ? 1 : 0.1
          return { ...item, quantity: Math.round((item.quantity + step) * 100) / 100 }
        }
        return item
      }),
    )
  }

  const decrementQuantity = (cartItemId) => {
    setCart(
      cart.map((item) => {
        if (item.cartItemId === cartItemId) {
          const step = item.unit === "piece" ? 1 : 0.1
          const newQuantity = Math.max(Math.round((item.quantity - step) * 100) / 100, step)
          return { ...item, quantity: newQuantity }
        }
        return item
      }),
    )
  }

  const handleProductSearch = (e) => {
    e.preventDefault()
    setShowSuggestions(false)

    if (filteredProducts.length > 0) {
      const productToAdd = filteredProducts[selectedSuggestionIndex]
      handleProductSelection(productToAdd)
    }
  }

  // Update the handleKeyDown function to scroll the selected item into view
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || filteredProducts.length === 0) return

    // Arrow down
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedSuggestionIndex((prevIndex) => {
        const newIndex = prevIndex < filteredProducts.length - 1 ? prevIndex + 1 : prevIndex
        // Scroll the item into view
        if (suggestionRefs.current[newIndex]) {
          suggestionRefs.current[newIndex]?.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
          })
        }
        return newIndex
      })
    }

    // Arrow up
    else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedSuggestionIndex((prevIndex) => {
        const newIndex = prevIndex > 0 ? prevIndex - 1 : 0
        // Scroll the item into view
        if (suggestionRefs.current[newIndex]) {
          suggestionRefs.current[newIndex]?.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
          })
        }
        return newIndex
      })
    }

    // Enter key
    else if (e.key === "Enter") {
      e.preventDefault()
      const productToAdd = filteredProducts[selectedSuggestionIndex]
      handleProductSelection(productToAdd)
      setSearchTerm("")
      setShowSuggestions(false)
    }

    // Escape key
    else if (e.key === "Escape") {
      setShowSuggestions(false)
    }
  }

  const handleSelectSuggestion = (product) => {
    setShowSuggestions(false)
    setSearchTerm("")
    handleProductSelection(product)
  }

  // Add a global keydown event listener to capture barcode scanner input
  useEffect(() => {
    // Barcode scanners typically send data very quickly, much faster than human typing
    const BARCODE_SCAN_TIMEOUT = 50 // ms between keystrokes

    const handleGlobalKeyDown = (e) => {
      // Only process if it's a character key or Enter
      if (e.key.length === 1 || e.key === "Enter") {
        const currentTime = new Date().getTime()

        // If this is a new scan sequence or continuing a fast sequence
        if (currentTime - lastKeyTime <= BARCODE_SCAN_TIMEOUT || barcodeBuffer === "") {
          // Clear any existing timeout
          if (barcodeTimeoutRef.current) {
            clearTimeout(barcodeTimeoutRef.current)
          }

          // If Enter key is pressed, process the barcode
          if (e.key === "Enter") {
            e.preventDefault() // Prevent form submissions

            // Process the barcode
            if (barcodeBuffer) {
              // Set the barcode input value
              setBarcodeInput(barcodeBuffer)

              // Process the barcode immediately
              const productWithBarcode = products.find((p) => p.barcode === barcodeBuffer)
              if (productWithBarcode) {
                handleProductSelection(productWithBarcode)
              } else {
                // Show error message if product not found
                setErrorMessage(`Product with barcode ${barcodeBuffer} not found`)
                setTimeout(() => setErrorMessage(""), 3000)
              }

              // Clear the buffer
              setBarcodeBuffer("")
            }
          } else {
            // Add the character to the buffer
            setBarcodeBuffer((prev) => prev + e.key)

            // Set a timeout to clear the buffer if no more keys are pressed
            barcodeTimeoutRef.current = setTimeout(() => {
              setBarcodeBuffer("")
            }, BARCODE_SCAN_TIMEOUT + 50)
          }

          setLastKeyTime(currentTime)
        }
      }
    }

    // Add the event listener
    window.addEventListener("keydown", handleGlobalKeyDown)

    // Clean up
    return () => {
      window.removeEventListener("keydown", handleGlobalKeyDown)
      if (barcodeTimeoutRef.current) {
        clearTimeout(barcodeTimeoutRef.current)
      }
    }
  }, [barcodeBuffer, lastKeyTime, products])

  // Update the handleBarcodeSearch function to use the new handleProductSelection function
  const handleBarcodeSearch = (e) => {
    e.preventDefault()

    if (!barcodeInput.trim()) return

    // Search for product by barcode
    const productWithBarcode = products.find((p) => p.barcode === barcodeInput)
    if (productWithBarcode) {
      handleProductSelection(productWithBarcode)
      setBarcodeInput("")
    } else {
      // Show error message if product not found
      setErrorMessage(`Product with barcode ${barcodeInput} not found`)
      setTimeout(() => setErrorMessage(""), 3000)
      setBarcodeInput("")
    }
  }

  // Add this function after the handleBarcodeKeyDown function
  const handleBatchDialogKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!selectedProduct || !batchDialogOpen) return

    const batchCount = selectedProduct.batches.length

    // Arrow down - move to next batch
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedBatchIndex((prevIndex) => (prevIndex < batchCount - 1 ? prevIndex + 1 : prevIndex))
    }
    // Arrow up - move to previous batch
    else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedBatchIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0))
    }
    // Enter key - select the current batch
    else if (e.key === "Enter") {
      e.preventDefault()
      const batch = selectedProduct.batches[selectedBatchIndex]
      if (batch) handleBatchSelect(batch)
    }
  }

  // Reset selected batch index when opening the batch dialog
  useEffect(() => {
    if (batchDialogOpen) {
      setSelectedBatchIndex(0)
    }
  }, [batchDialogOpen])

  const handleBatchSelect = (batch) => {
    setSelectedBatch(batch)

    if (selectedProduct.unit === "piece") {
      // For piece items, set default quantity to 1
      setQuantity("1")
    } else {
      // For weight/volume items, also set default to 1 but will need to adjust
      setQuantity("1")
    }

    // Close batch dialog and open quantity dialog
    setBatchDialogOpen(false)
    setQuantityDialogOpen(true)
  }

  const handleAddQuantity = () => {
    addToCart(selectedProduct, selectedBatch, quantity)
    setQuantityDialogOpen(false)
    setSelectedBatch(null)

    // Focus is already handled in addToCart, but adding here for redundancy
    setTimeout(() => {
      if (barcodeInputRef.current) {
        barcodeInputRef.current.focus()
      }
    }, 100)
  }

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const formatUnitLabel = (unit, quantity) => {
    if (unit === "piece") return quantity > 1 ? "pieces" : "piece"
    return unit
  }

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const handleCheckout = () => {
    if (paymentMethod === "credit" && !selectedCustomer) {
      return // Require customer for credit sales
    }

    // Process the sale
    const total = calculateTotal()
    console.log("Sale completed:", {
      items: cart,
      total,
      paymentMethod,
      customer: selectedCustomer,
      timestamp: new Date(),
    })

    // Reset the cart and show success
    setCart([])
    setSuccessMessage(`Sale completed: $${total.toFixed(2)}`)
    setTimeout(() => setSuccessMessage(""), 3000)

    // Focus back on barcode input after completing sale
    if (barcodeInputRef.current) {
      barcodeInputRef.current.focus()
    }
  }

  // Add a keyDown handler for the quantity dialog
  const handleQuantityKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // Arrow up - increase quantity
    if (e.key === "ArrowUp") {
      e.preventDefault()
      const current = Number.parseFloat(quantity)
      if (!isNaN(current)) {
        setQuantity((current + 0.1).toFixed(1))
      } else {
        setQuantity("0.1")
      }
    }
    // Arrow down - decrease quantity
    else if (e.key === "ArrowDown") {
      e.preventDefault()
      const current = Number.parseFloat(quantity)
      if (!isNaN(current) && current > 0.1) {
        setQuantity((current - 0.1).toFixed(1))
      }
    }
    // Enter key - add to cart
    else if (e.key === "Enter") {
      e.preventDefault()
      handleAddQuantity()
    }
    // Escape key - close dialog (handled by Dialog component)
  }

  // Add a useEffect to focus the quantity input when dialog opens
  useEffect(() => {
    if (quantityDialogOpen) {
      // Short timeout to ensure the dialog is fully rendered
      const timer = setTimeout(() => {
        const quantityInput = document.getElementById("quantity")
        if (quantityInput) {
          quantityInput.focus()
        }
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [quantityDialogOpen])

  // Function to generate a new barcode
  const generateBarcode = (productId) => {
    // Simple barcode generation - in a real system this would be more sophisticated
    return `2000000${productId.toString().padStart(3, "0")}`
  }

  // Add this useEffect to focus barcode input when dialogs close
  useEffect(() => {
    if (!batchDialogOpen && !quantityDialogOpen && !customerDialogOpen) {
      // Short timeout to ensure focus happens after dialog animations
      const timer = setTimeout(() => {
        if (barcodeInputRef.current) {
          barcodeInputRef.current.focus()
        }
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [batchDialogOpen, quantityDialogOpen, customerDialogOpen])

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header with search and barcode scan */}
      <div className="p-6 border-b border-border bg-card shadow-sm">
        <div className="max-w-6xl mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">Point of Sale</h1>
            <div className="flex items-center gap-2">
              {successMessage && (
                <div className="bg-green-500/10 text-green-500 dark:bg-green-900/30 dark:text-green-300 text-sm py-1 px-3 rounded-full flex items-center">
                  <Check className="h-3.5 w-3.5 mr-1" />
                  {successMessage}
                </div>
              )}
              {errorMessage && (
                <div className="bg-red-500/10 text-red-500 dark:bg-red-900/30 dark:text-red-300 text-sm py-1 px-3 rounded-full flex items-center">
                  <AlertCircle className="h-3.5 w-3.5 mr-1" />
                  {errorMessage}
                </div>
              )}
              <Button
                variant={selectedCustomer ? "default" : "outline"}
                className="flex gap-2"
                onClick={() => setCustomerDialogOpen(true)}
              >
                <User className="h-4 w-4" />
                {selectedCustomer ? selectedCustomer.name : "Select Customer"}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative" ref={searchRef}>
              <form onSubmit={handleProductSearch} className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  ref={searchInputRef}
                  type="search"
                  placeholder="Search products... (use ↑↓ to navigate, Enter to select)"
                  className="w-full pl-9 h-11"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setShowSuggestions(e.target.value.length > 0)
                  }}
                  onFocus={() => {
                    if (searchTerm.length > 0) setShowSuggestions(true)
                  }}
                  onKeyDown={handleKeyDown}
                />
              </form>

              {/* Product suggestions dropdown */}
              {showSuggestions && filteredProducts.length > 0 && (
                <div className="absolute z-50 mt-1 w-full bg-popover border border-border rounded-md shadow-lg max-h-60 overflow-auto">
                  {filteredProducts.map((product, index) => (
                    <div
                      key={product.id}
                      ref={(el) => (suggestionRefs.current[index] = el)}
                      className={`flex items-center p-3 cursor-pointer border-b border-border last:border-0 ${
                        index === selectedSuggestionIndex ? "bg-primary/10 text-primary" : "hover:bg-muted"
                      }`}
                      onClick={() => handleSelectSuggestion(product)}
                      onMouseEnter={() => setSelectedSuggestionIndex(index)}
                    >
                      <div className="flex-1">
                        <div className="font-medium text-foreground">{product.name}</div>
                        <div className="text-sm text-muted-foreground">{product.category}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {product.batches.length} {product.batches.length === 1 ? "batch" : "batches"} available
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-primary font-medium">
                          {product.batches.length > 0
                            ? `$${Math.min(...product.batches.map((b) => b.price)).toFixed(2)} - $${Math.max(...product.batches.map((b) => b.price)).toFixed(2)}`
                            : "No price"}
                        </div>
                        <Badge variant="outline" className="text-foreground">
                          {product.unit}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <form onSubmit={handleBarcodeSearch} className="relative">
              <BarcodeScan className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                ref={barcodeInputRef}
                placeholder="Scan barcode..."
                className="w-full pl-9 h-11"
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
              />
            </form>
          </div>
        </div>
      </div>

      {/* Cart Section */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium flex items-center gap-2 text-foreground">
                <ShoppingCart className="h-5 w-5" />
                Current Sale
                {cart.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {cart.length} {cart.length === 1 ? "item" : "items"}
                  </Badge>
                )}
              </h2>
            </div>

            {cart.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
                  <p className="text-muted-foreground mb-2">Your cart is empty</p>
                  <p className="text-sm text-muted-foreground">Search for products or scan barcodes to add items</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {cart.map((item) => (
                  <Card key={item.cartItemId} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex items-center p-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium truncate text-foreground">{item.name}</h3>
                          <div className="text-sm text-muted-foreground mt-0.5">
                            <span className="text-primary font-medium">${item.price.toFixed(2)}</span> / {item.unit}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              Batch {item.batch.batchNumber}
                            </Badge>
                            <span className="text-xs text-muted-foreground flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              Exp: {formatDate(item.batch.expiryDate)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 ml-4">
                          <div className="flex items-center border rounded-md overflow-hidden">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-none border-r"
                              onClick={() => decrementQuantity(item.cartItemId)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updateQuantity(item.cartItemId, e.target.value)}
                              className="w-16 h-8 border-0 text-center"
                              min="0.01"
                              step={item.unit === "piece" ? "1" : "0.1"}
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-none border-l"
                              onClick={() => incrementQuantity(item.cartItemId)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="w-16 text-sm text-muted-foreground">
                            {formatUnitLabel(item.unit, item.quantity)}
                          </div>
                          <div className="w-24 text-right font-medium text-foreground">
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => removeFromCart(item.cartItemId)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-border bg-card p-6 shadow-sm">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6 items-end">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="payment-method">Payment Method</Label>
                  <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                    <SelectTrigger id="payment-method" className="h-11">
                      <SelectValue placeholder="Payment Method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          Cash
                        </div>
                      </SelectItem>
                      <SelectItem value="card">
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4" />
                          Card
                        </div>
                      </SelectItem>
                      <SelectItem value="credit">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Store Credit
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {paymentMethod === "credit" && !selectedCustomer && (
                  <div className="bg-amber-500/10 text-amber-600 dark:bg-amber-900/20 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50 rounded-lg p-3 text-sm">
                    Please select a customer for credit sales
                  </div>
                )}

                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={() => setCart([])} disabled={cart.length === 0}>
                    Clear Sale
                  </Button>
                  <Button
                    className="flex-1 h-11"
                    disabled={cart.length === 0 || (paymentMethod === "credit" && !selectedCustomer)}
                    onClick={handleCheckout}
                  >
                    Complete Sale
                  </Button>
                </div>
              </div>

              <div className="bg-muted rounded-lg p-4 space-y-3 border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">${calculateTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span className="text-foreground">${(calculateTotal() * 0.1).toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-semibold">
                  <span className="text-foreground">Total</span>
                  <span className="text-foreground">${(calculateTotal() * 1.1).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Batch Selection Dialog */}
      <Dialog open={batchDialogOpen} onOpenChange={setBatchDialogOpen}>
        <DialogContent className="sm:max-w-[500px]" onKeyDown={handleBatchDialogKeyDown}>
          <DialogHeader>
            <DialogTitle>Select Batch</DialogTitle>
            <DialogDescription>
              {selectedProduct && `Select a batch for ${selectedProduct.name}`}
              <div className="mt-1 text-xs">Use ↑↓ arrows to navigate, Enter to select</div>
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <RadioGroup
              className="space-y-3"
              onValueChange={(value) => {
                const batch = selectedProduct?.batches.find((b) => b.id === value)
                if (batch) handleBatchSelect(batch)
              }}
              value={selectedProduct?.batches[selectedBatchIndex]?.id}
            >
              {selectedProduct?.batches.map((batch, index) => (
                <div
                  key={batch.id}
                  className={`flex items-center space-x-2 border rounded-md p-3 hover:bg-muted/50 cursor-pointer ${
                    index === selectedBatchIndex ? "bg-primary/10 border-primary/50" : ""
                  }`}
                  onClick={() => {
                    setSelectedBatchIndex(index)
                    // Don't immediately select the batch on click, just highlight it
                  }}
                  onDoubleClick={() => handleBatchSelect(batch)}
                >
                  <RadioGroupItem value={batch.id} id={batch.id} className="peer" />
                  <Label
                    htmlFor={batch.id}
                    className="flex flex-1 justify-between cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    <div>
                      <div className="font-medium">Batch {batch.batchNumber}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          Expires: {formatDate(batch.expiryDate)}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-primary">${batch.price.toFixed(2)}</div>
                      <Badge variant="outline" className="mt-1">
                        {batch.quantity}{" "}
                        {selectedProduct?.unit === "piece"
                          ? batch.quantity === 1
                            ? "piece"
                            : "pieces"
                          : selectedProduct?.unit}
                      </Badge>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBatchDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                const batch = selectedProduct?.batches[selectedBatchIndex]
                if (batch) handleBatchSelect(batch)
              }}
            >
              Select Batch
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Quantity Dialog */}
      <Dialog open={quantityDialogOpen} onOpenChange={setQuantityDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Enter Quantity</DialogTitle>
            <DialogDescription>
              {selectedProduct &&
                selectedBatch &&
                `Enter the quantity of ${selectedProduct.name} (Batch ${selectedBatch.batchNumber})`}
              <div className="mt-1 text-xs">Use ↑↓ arrows to adjust, Enter to confirm</div>
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="quantity">Quantity ({selectedProduct?.unit})</Label>
                <span className="text-xs text-muted-foreground">
                  Available: {selectedBatch?.quantity} {formatUnitLabel(selectedProduct?.unit, selectedBatch?.quantity)}
                </span>
              </div>
              <div className="flex">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="rounded-r-none"
                  onClick={() => {
                    const current = Number.parseFloat(quantity)
                    if (!isNaN(current) && current > 0.1) {
                      setQuantity((current - 0.1).toFixed(1))
                    }
                  }}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  id="quantity"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  onKeyDown={handleQuantityKeyDown}
                  min="0.01"
                  max={selectedBatch?.quantity.toString()}
                  step={selectedProduct?.unit === "piece" ? "1" : "0.1"}
                  className="rounded-none text-center border-x-0"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="rounded-l-none"
                  onClick={() => {
                    const current = Number.parseFloat(quantity)
                    if (!isNaN(current)) {
                      const max = selectedBatch?.quantity || 0
                      const newValue = Math.min(current + 0.1, max)
                      setQuantity(newValue.toFixed(1))
                    } else {
                      setQuantity("0.1")
                    }
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setQuantityDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddQuantity}
              disabled={
                Number.parseFloat(quantity) <= 0 || Number.parseFloat(quantity) > (selectedBatch?.quantity || 0)
              }
            >
              Add to Cart
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Customer Dialog */}
      <Dialog open={customerDialogOpen} onOpenChange={setCustomerDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Select Customer</DialogTitle>
            <DialogDescription>Select a customer for this sale or continue as a guest.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="customer-search">Search Customers</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="customer-search" placeholder="Search by name or phone..." className="pl-9" />
              </div>
            </div>
            <div className="max-h-[200px] overflow-auto border rounded-md divide-y">
              {customers.map((customer) => (
                <div
                  key={customer.id}
                  className="p-3 hover:bg-muted cursor-pointer transition-colors"
                  onClick={() => {
                    setSelectedCustomer(customer)
                    setCustomerDialogOpen(false)
                  }}
                >
                  <div className="font-medium text-foreground">{customer.name}</div>
                  <div className="text-sm text-muted-foreground">{customer.phone}</div>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              className="sm:flex-1"
              onClick={() => {
                setSelectedCustomer(null)
                setCustomerDialogOpen(false)
              }}
            >
              Continue as Guest
            </Button>
            <Button className="sm:flex-1">Add New Customer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
