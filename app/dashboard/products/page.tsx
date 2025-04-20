"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertCircle,
  Calendar,
  ChevronDown,
  ChevronRight,
  Edit,
  MoreHorizontal,
  Package,
  Plus,
  Search,
  ScanBarcode,
  Trash2,
} from "lucide-react"

// Updated product data structure - removed price and stock from product level
const initialProducts = [
  {
    id: "1",
    name: "Apples",
    unit: "kg",
    category: "Fruits",
    barcode: "2000000001",
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
    barcode: "2000000002",
    batches: [{ id: "2-A", batchNumber: "M101", expiryDate: "2023-05-10", quantity: 30, price: 3.49 }],
  },
  {
    id: "3",
    name: "Bread",
    unit: "piece",
    category: "Bakery",
    barcode: "2000000003",
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
    batches: [{ id: "5-A", batchNumber: "W401", expiryDate: "2024-12-31", quantity: 10, price: 12.99 }],
  },
]

export default function ProductsPage() {
  const [products, setProducts] = useState(initialProducts)
  const [productDialogOpen, setProductDialogOpen] = useState(false)
  const [batchDialogOpen, setBatchDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedProducts, setExpandedProducts] = useState<string[]>([])
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [selectedBatch, setSelectedBatch] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)

  // Updated new product state - removed price
  const [newProduct, setNewProduct] = useState({
    name: "",
    unit: "piece",
    category: "",
    barcode: "",
  })

  // Updated new batch state - added price
  const [newBatch, setNewBatch] = useState({
    batchNumber: "",
    expiryDate: "",
    quantity: "",
    price: "",
  })

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.barcode.includes(searchTerm),
  )

  const toggleProductExpand = (productId: string) => {
    setExpandedProducts((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId],
    )
  }

  // Helper function to calculate total stock for a product
  const calculateTotalStock = (product) => {
    return product.batches.reduce((sum, batch) => sum + batch.quantity, 0)
  }

  // Helper function to calculate average price for a product
  const calculateAveragePrice = (product) => {
    if (product.batches.length === 0) return 0

    // Calculate weighted average price based on quantity
    const totalValue = product.batches.reduce((sum, batch) => sum + batch.price * batch.quantity, 0)
    const totalQuantity = product.batches.reduce((sum, batch) => sum + batch.quantity, 0)

    return totalQuantity > 0 ? totalValue / totalQuantity : 0
  }

  // Helper function to get the latest batch price
  const getLatestBatchPrice = (product) => {
    if (product.batches.length === 0) return 0

    // Sort batches by expiry date (descending) and return the price of the latest batch
    const sortedBatches = [...product.batches].sort(
      (a, b) => new Date(b.expiryDate).getTime() - new Date(a.expiryDate).getTime(),
    )

    return sortedBatches[0].price
  }

  // Updated to remove price from product
  const handleAddProduct = () => {
    const productToAdd = {
      id: Date.now().toString(),
      name: newProduct.name,
      unit: newProduct.unit,
      category: newProduct.category,
      barcode: newProduct.barcode || generateBarcode(Date.now().toString()),
      batches: [],
    }

    setProducts([...products, productToAdd])
    setNewProduct({
      name: "",
      unit: "piece",
      category: "",
      barcode: "",
    })
    setProductDialogOpen(false)
  }

  // Updated to remove price from product
  const handleEditProduct = () => {
    if (!selectedProduct) return

    const updatedProducts = products.map((product) => {
      if (product.id === selectedProduct.id) {
        return {
          ...product,
          name: newProduct.name,
          unit: newProduct.unit,
          category: newProduct.category,
          barcode: newProduct.barcode,
        }
      }
      return product
    })

    setProducts(updatedProducts)
    setProductDialogOpen(false)
    setIsEditing(false)
  }

  const handleDeleteProduct = (productId: string) => {
    setProducts(products.filter((product) => product.id !== productId))
  }

  // Updated to remove price from product
  const openEditProductDialog = (product) => {
    setSelectedProduct(product)
    setNewProduct({
      name: product.name,
      unit: product.unit,
      category: product.category,
      barcode: product.barcode,
    })
    setIsEditing(true)
    setProductDialogOpen(true)
  }

  const openAddBatchDialog = (product) => {
    setSelectedProduct(product)
    setNewBatch({
      batchNumber: "",
      expiryDate: new Date().toISOString().split("T")[0],
      quantity: "",
      price: "",
    })
    setIsEditing(false)
    setBatchDialogOpen(true)
  }

  // Updated to include price in batch
  const openEditBatchDialog = (product, batch) => {
    setSelectedProduct(product)
    setSelectedBatch(batch)
    setNewBatch({
      batchNumber: batch.batchNumber,
      expiryDate: batch.expiryDate,
      quantity: batch.quantity.toString(),
      price: batch.price.toString(),
    })
    setIsEditing(true)
    setBatchDialogOpen(true)
  }

  // Updated to include price in batch
  const handleAddBatch = () => {
    if (!selectedProduct) return

    const batchToAdd = {
      id: `${selectedProduct.id}-${Date.now()}`,
      batchNumber: newBatch.batchNumber,
      expiryDate: newBatch.expiryDate,
      quantity: Number.parseInt(newBatch.quantity),
      price: Number.parseFloat(newBatch.price),
    }

    const updatedProducts = products.map((product) => {
      if (product.id === selectedProduct.id) {
        return {
          ...product,
          batches: [...product.batches, batchToAdd],
        }
      }
      return product
    })

    setProducts(updatedProducts)
    setBatchDialogOpen(false)
  }

  // Updated to include price in batch
  const handleEditBatch = () => {
    if (!selectedProduct || !selectedBatch) return

    const updatedProducts = products.map((product) => {
      if (product.id === selectedProduct.id) {
        const updatedBatches = product.batches.map((batch) => {
          if (batch.id === selectedBatch.id) {
            return {
              ...batch,
              batchNumber: newBatch.batchNumber,
              expiryDate: newBatch.expiryDate,
              quantity: Number.parseInt(newBatch.quantity),
              price: Number.parseFloat(newBatch.price),
            }
          }
          return batch
        })

        return {
          ...product,
          batches: updatedBatches,
        }
      }
      return product
    })

    setProducts(updatedProducts)
    setBatchDialogOpen(false)
    setIsEditing(false)
  }

  const handleDeleteBatch = (productId: string, batchId: string) => {
    const updatedProducts = products.map((product) => {
      if (product.id === productId) {
        return {
          ...product,
          batches: product.batches.filter((batch) => batch.id !== batchId),
        }
      }
      return product
    })

    setProducts(updatedProducts)
  }

  const generateBarcode = (productId: string) => {
    // Simple barcode generation - in a real system this would be more sophisticated
    return `2000000${productId.slice(-3).padStart(3, "0")}`
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "short", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">Manage your inventory and product catalog.</p>
        </div>
        <Dialog open={productDialogOpen} onOpenChange={setProductDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>{isEditing ? "Edit Product" : "Add New Product"}</DialogTitle>
              <DialogDescription>
                {isEditing ? "Update product information." : "Add a new product to your inventory."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="grid gap-3">
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="h-10"
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="unit">Unit</Label>
                  <Select
                    value={newProduct.unit}
                    onValueChange={(value) => setNewProduct({ ...newProduct, unit: value })}
                  >
                    <SelectTrigger id="unit" className="h-10">
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="piece">Piece</SelectItem>
                      <SelectItem value="kg">Kilogram (kg)</SelectItem>
                      <SelectItem value="g">Gram (g)</SelectItem>
                      <SelectItem value="liter">Liter</SelectItem>
                      <SelectItem value="ml">Milliliter (ml)</SelectItem>
                      <SelectItem value="bottle">Bottle (750ml)</SelectItem>
                      <SelectItem value="half_bottle">Half Bottle (375ml)</SelectItem>
                      <SelectItem value="quarter_bottle">Quarter Bottle (187ml)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="h-10"
                  />
                </div>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="barcode">Barcode (optional)</Label>
                <div className="relative">
                  <ScanBarcode className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="barcode"
                    value={newProduct.barcode}
                    onChange={(e) => setNewProduct({ ...newProduct, barcode: e.target.value })}
                    className="h-10 pl-9"
                    placeholder="Auto-generated if empty"
                  />
                </div>
              </div>
              {!isEditing && (
                <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/30 rounded-md p-3 text-sm text-amber-600 dark:text-amber-400 flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <div>
                    After creating the product, you'll need to add at least one batch with price and quantity
                    information.
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setProductDialogOpen(false)
                  setIsEditing(false)
                }}
              >
                Cancel
              </Button>
              <Button onClick={isEditing ? handleEditProduct : handleAddProduct}>
                {isEditing ? "Update Product" : "Add Product"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Batch Dialog - Updated to include price */}
        <Dialog open={batchDialogOpen} onOpenChange={setBatchDialogOpen}>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>{isEditing ? "Edit Batch" : "Add New Batch"}</DialogTitle>
              <DialogDescription>
                {isEditing
                  ? `Update batch information for ${selectedProduct?.name}.`
                  : `Add a new batch for ${selectedProduct?.name}.`}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="grid gap-3">
                <Label htmlFor="batchNumber">Batch Number</Label>
                <Input
                  id="batchNumber"
                  value={newBatch.batchNumber}
                  onChange={(e) => setNewBatch({ ...newBatch, batchNumber: e.target.value })}
                  className="h-10"
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="price">Price (per {selectedProduct?.unit})</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={newBatch.price}
                    onChange={(e) => setNewBatch({ ...newBatch, price: e.target.value })}
                    className="h-10"
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="quantity">Quantity ({selectedProduct?.unit})</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={newBatch.quantity}
                    onChange={(e) => setNewBatch({ ...newBatch, quantity: e.target.value })}
                    className="h-10"
                  />
                </div>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="expiryDate"
                    type="date"
                    value={newBatch.expiryDate}
                    onChange={(e) => setNewBatch({ ...newBatch, expiryDate: e.target.value })}
                    className="h-10 pl-9"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setBatchDialogOpen(false)
                  setIsEditing(false)
                }}
              >
                Cancel
              </Button>
              <Button onClick={isEditing ? handleEditBatch : handleAddBatch}>
                {isEditing ? "Update Batch" : "Add Batch"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>Product Inventory</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <CardDescription>Manage your product catalog, batches, and inventory levels.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10"></TableHead>
                    <TableHead className="w-[20%]">Name</TableHead>
                    <TableHead className="w-[10%]">Current Price</TableHead>
                    <TableHead className="w-[10%]">Unit</TableHead>
                    <TableHead className="w-[10%]">Total Stock</TableHead>
                    <TableHead className="w-[15%]">Category</TableHead>
                    <TableHead className="w-[15%]">Barcode</TableHead>
                    <TableHead className="w-[10%] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <>
                      <TableRow key={product.id} className="group">
                        <TableCell className="p-0 w-10">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => toggleProductExpand(product.id)}
                          >
                            {expandedProducts.includes(product.id) ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </Button>
                        </TableCell>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>
                          {product.batches.length > 0 ? (
                            `$${getLatestBatchPrice(product).toFixed(2)}`
                          ) : (
                            <Badge variant="outline" className="text-muted-foreground">
                              No batches
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>{product.unit}</TableCell>
                        <TableCell>
                          {product.batches.length > 0 ? (
                            <Badge
                              variant={
                                calculateTotalStock(product) > 50
                                  ? "default"
                                  : calculateTotalStock(product) > 20
                                    ? "outline"
                                    : "destructive"
                              }
                            >
                              {calculateTotalStock(product)}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-muted-foreground">
                              No stock
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 max-w-[150px]">
                            <ScanBarcode className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                            <span className="text-xs font-mono truncate">{product.barcode}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => openEditProductDialog(product)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Product
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => openAddBatchDialog(product)}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Batch
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => handleDeleteProduct(product.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Product
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                      {expandedProducts.includes(product.id) && (
                        <TableRow className="bg-muted/50">
                          <TableCell colSpan={8} className="p-4">
                            <div className="mb-2 flex items-center justify-between">
                              <h4 className="text-sm font-medium">Batches</h4>
                              <Button variant="outline" size="sm" onClick={() => openAddBatchDialog(product)}>
                                <Plus className="mr-1 h-3 w-3" />
                                Add Batch
                              </Button>
                            </div>
                            {product.batches.length > 0 ? (
                              <div className="rounded-md border bg-background overflow-x-auto">
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead className="w-[20%]">Batch Number</TableHead>
                                      <TableHead className="w-[20%]">Price</TableHead>
                                      <TableHead className="w-[20%]">Quantity</TableHead>
                                      <TableHead className="w-[25%]">Expiry Date</TableHead>
                                      <TableHead className="w-[15%] text-right">Actions</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {product.batches.map((batch) => (
                                      <TableRow key={batch.id}>
                                        <TableCell className="font-medium">{batch.batchNumber}</TableCell>
                                        <TableCell>${batch.price.toFixed(2)}</TableCell>
                                        <TableCell>
                                          <Badge variant="outline">
                                            {batch.quantity} {product.unit}
                                            {product.unit === "piece" && batch.quantity !== 1 ? "s" : ""}
                                          </Badge>
                                        </TableCell>
                                        <TableCell>
                                          <div className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3 flex-shrink-0 text-muted-foreground" />
                                            <span>{formatDate(batch.expiryDate)}</span>
                                          </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                          <div className="flex justify-end gap-2">
                                            <Button
                                              variant="ghost"
                                              size="icon"
                                              className="h-7 w-7"
                                              onClick={() => openEditBatchDialog(product, batch)}
                                            >
                                              <Edit className="h-3.5 w-3.5" />
                                            </Button>
                                            <Button
                                              variant="ghost"
                                              size="icon"
                                              className="h-7 w-7 text-destructive"
                                              onClick={() => handleDeleteBatch(product.id, batch.id)}
                                            >
                                              <Trash2 className="h-3.5 w-3.5" />
                                            </Button>
                                          </div>
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>
                            ) : (
                              <div className="rounded-md border bg-background p-4 text-center text-sm text-muted-foreground">
                                No batches available for this product.
                                <div className="mt-2">
                                  <Button variant="outline" size="sm" onClick={() => openAddBatchDialog(product)}>
                                    <Plus className="mr-1 h-3 w-3" />
                                    Add First Batch
                                  </Button>
                                </div>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  ))}
                  {filteredProducts.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} className="h-24 text-center">
                        No products found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inventory Summary</CardTitle>
            <CardDescription>Overview of your product inventory</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Total Products</span>
                  <span className="font-medium">{products.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Total Batches</span>
                  <span className="font-medium">
                    {products.reduce((sum, product) => sum + product.batches.length, 0)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Products with No Stock</span>
                  <span className="font-medium">
                    {products.filter((product) => calculateTotalStock(product) === 0).length}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Low Stock Items</span>
                  <span className="font-medium">
                    {
                      products.filter((product) => {
                        const stock = calculateTotalStock(product)
                        return stock > 0 && stock <= 20
                      }).length
                    }
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Expiring Soon</span>
                  <span className="font-medium">
                    {products.reduce((count, product) => {
                      const now = new Date()
                      const thirtyDaysFromNow = new Date()
                      thirtyDaysFromNow.setDate(now.getDate() + 30)

                      const expiringBatches = product.batches.filter((batch) => {
                        const expiryDate = new Date(batch.expiryDate)
                        return expiryDate > now && expiryDate <= thirtyDaysFromNow
                      })

                      return count + expiringBatches.length
                    }, 0)}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Categories</h4>
                <div className="space-y-2">
                  {Array.from(new Set(products.map((p) => p.category))).map((category) => (
                    <div key={category} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{category}</span>
                      <span className="font-medium">{products.filter((p) => p.category === category).length}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <Button variant="outline" className="w-full">
                  <Package className="mr-2 h-4 w-4" />
                  Generate Inventory Report
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
