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

// Sample product data with batches
const initialProducts = [
  {
    id: "1",
    name: "Apples",
    price: 2.99,
    unit: "kg",
    stock: 125,
    category: "Fruits",
    barcode: "2000000001",
    batches: [
      { id: "1-A", batchNumber: "A001", expiryDate: "2023-06-15", quantity: 50 },
      { id: "1-B", batchNumber: "A002", expiryDate: "2023-06-20", quantity: 75 },
    ],
  },
  {
    id: "2",
    name: "Milk",
    price: 3.49,
    unit: "liter",
    stock: 30,
    category: "Dairy",
    barcode: "2000000002",
    batches: [{ id: "2-A", batchNumber: "M101", expiryDate: "2023-05-10", quantity: 30 }],
  },
  {
    id: "3",
    name: "Bread",
    price: 2.29,
    unit: "piece",
    stock: 45,
    category: "Bakery",
    barcode: "2000000003",
    batches: [
      { id: "3-A", batchNumber: "B201", expiryDate: "2023-05-05", quantity: 20 },
      { id: "3-B", batchNumber: "B202", expiryDate: "2023-05-07", quantity: 25 },
    ],
  },
  {
    id: "4",
    name: "Chicken Breast",
    price: 8.99,
    unit: "kg",
    stock: 35,
    category: "Meat",
    barcode: "2000000004",
    batches: [
      { id: "4-A", batchNumber: "C301", expiryDate: "2023-05-08", quantity: 15 },
      { id: "4-B", batchNumber: "C302", expiryDate: "2023-05-12", quantity: 20 },
    ],
  },
  {
    id: "5",
    name: "Red Wine",
    price: 12.99,
    unit: "bottle",
    stock: 10,
    category: "Beverages",
    barcode: "2000000005",
    batches: [{ id: "5-A", batchNumber: "W401", expiryDate: "2024-12-31", quantity: 10 }],
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

  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    unit: "piece",
    stock: "",
    category: "",
    barcode: "",
  })

  const [newBatch, setNewBatch] = useState({
    batchNumber: "",
    expiryDate: "",
    quantity: "",
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

  const handleAddProduct = () => {
    const productToAdd = {
      id: Date.now().toString(),
      name: newProduct.name,
      price: Number.parseFloat(newProduct.price),
      unit: newProduct.unit,
      stock: 0, // Stock will be calculated from batches
      category: newProduct.category,
      barcode: newProduct.barcode || generateBarcode(Date.now().toString()),
      batches: [],
    }

    setProducts([...products, productToAdd])
    setNewProduct({
      name: "",
      price: "",
      unit: "piece",
      stock: "",
      category: "",
      barcode: "",
    })
    setProductDialogOpen(false)
  }

  const handleEditProduct = () => {
    if (!selectedProduct) return

    const updatedProducts = products.map((product) => {
      if (product.id === selectedProduct.id) {
        return {
          ...product,
          name: newProduct.name,
          price: Number.parseFloat(newProduct.price),
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

  const openEditProductDialog = (product) => {
    setSelectedProduct(product)
    setNewProduct({
      name: product.name,
      price: product.price.toString(),
      unit: product.unit,
      stock: product.stock.toString(),
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
    })
    setIsEditing(false)
    setBatchDialogOpen(true)
  }

  const openEditBatchDialog = (product, batch) => {
    setSelectedProduct(product)
    setSelectedBatch(batch)
    setNewBatch({
      batchNumber: batch.batchNumber,
      expiryDate: batch.expiryDate,
      quantity: batch.quantity.toString(),
    })
    setIsEditing(true)
    setBatchDialogOpen(true)
  }

  const handleAddBatch = () => {
    if (!selectedProduct) return

    const batchToAdd = {
      id: `${selectedProduct.id}-${Date.now()}`,
      batchNumber: newBatch.batchNumber,
      expiryDate: newBatch.expiryDate,
      quantity: Number.parseInt(newBatch.quantity),
    }

    const updatedProducts = products.map((product) => {
      if (product.id === selectedProduct.id) {
        const updatedBatches = [...product.batches, batchToAdd]
        const totalStock = updatedBatches.reduce((sum, batch) => sum + batch.quantity, 0)

        return {
          ...product,
          batches: updatedBatches,
          stock: totalStock,
        }
      }
      return product
    })

    setProducts(updatedProducts)
    setBatchDialogOpen(false)
  }

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
            }
          }
          return batch
        })

        const totalStock = updatedBatches.reduce((sum, batch) => sum + batch.quantity, 0)

        return {
          ...product,
          batches: updatedBatches,
          stock: totalStock,
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
        const updatedBatches = product.batches.filter((batch) => batch.id !== batchId)
        const totalStock = updatedBatches.reduce((sum, batch) => sum + batch.quantity, 0)

        return {
          ...product,
          batches: updatedBatches,
          stock: totalStock,
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
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    className="h-10"
                  />
                </div>
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
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="h-10"
                  />
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
              </div>
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

        {/* Batch Dialog */}
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
                    <TableHead className="w-[10%]">Price</TableHead>
                    <TableHead className="w-[10%]">Unit</TableHead>
                    <TableHead className="w-[10%]">Stock</TableHead>
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
                        <TableCell>${product.price.toFixed(2)}</TableCell>
                        <TableCell>{product.unit}</TableCell>
                        <TableCell>
                          <Badge
                            variant={product.stock > 50 ? "default" : product.stock > 20 ? "outline" : "destructive"}
                          >
                            {product.stock}
                          </Badge>
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
                                      <TableHead className="w-[30%]">Batch Number</TableHead>
                                      <TableHead className="w-[30%]">Expiry Date</TableHead>
                                      <TableHead className="w-[25%]">Quantity</TableHead>
                                      <TableHead className="w-[15%] text-right">Actions</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {product.batches.map((batch) => (
                                      <TableRow key={batch.id}>
                                        <TableCell className="font-medium">{batch.batchNumber}</TableCell>
                                        <TableCell>
                                          <div className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3 flex-shrink-0 text-muted-foreground" />
                                            <span>{formatDate(batch.expiryDate)}</span>
                                          </div>
                                        </TableCell>
                                        <TableCell>
                                          <Badge variant="outline">
                                            {batch.quantity} {product.unit}
                                            {product.unit === "piece" && batch.quantity !== 1 ? "s" : ""}
                                          </Badge>
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
                  <span className="text-muted-foreground">Low Stock Items</span>
                  <span className="font-medium">{products.filter((p) => p.stock <= 20).length}</span>
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
