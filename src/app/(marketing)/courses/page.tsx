'use client';

import { useEffect, useState } from 'react';
import api from '@/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, SlidersHorizontal, Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useDebounce } from 'usehooks-ts';
import CourseCard from '@/app/(dashboard-student)/student/(routes)/(courses)/components/CourseCard';

interface Category {
  _id: string;
  name: string;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [priceFilter, setPriceFilter] = useState('all');
  const [sortBy, setSortBy] = useState('popular');

  /* ===================================== */
  /* Fetch Categories */
  /* ===================================== */

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/v1/admin/categories');
        setCategories(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCategories();
  }, []);

  /* ===================================== */
  /* Fetch Courses */
  /* ===================================== */

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);

        const res = await api.get('/v1/courses/course/getAllPublicCourses', {
          params: {
            search: debouncedSearch,
            categories: selectedCategories.join(','),
            level: selectedLevels.join(','),
            price: priceFilter,
            sort: sortBy,
          },
        });

        console.log(res)

        setCourses(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [
    debouncedSearch,
    selectedCategories,
    selectedLevels,
    priceFilter,
    sortBy,
  ]);

  /* ===================================== */
  /* Toggle Helpers */
  /* ===================================== */

  const toggleCategory = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id)
        ? prev.filter((c) => c !== id)
        : [...prev, id]
    );
  };

  const toggleLevel = (level: string) => {
    setSelectedLevels((prev) =>
      prev.includes(level)
        ? prev.filter((l) => l !== level)
        : [...prev, level]
    );
  };

  /* ===================================== */
  /* Filter Sidebar Component */
  /* ===================================== */

  const FilterSidebar = () => (
    <div className="space-y-6">

      {/* Categories */}
      <div>
        <h3 className="font-semibold mb-3">Category</h3>
        <div className="space-y-2">
          {categories.map((cat) => (
            <div key={cat._id} className="flex items-center gap-2">
              <Checkbox
                checked={selectedCategories.includes(cat._id)}
                onCheckedChange={() => toggleCategory(cat._id)}
              />
              <span className="text-sm">{cat.name}</span>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Price */}
      <div>
        <h3 className="font-semibold mb-3">Price</h3>
        <div className="space-y-2">
          {['all', 'free', 'paid'].map((type) => (
            <div key={type} className="flex items-center gap-2">
              <Checkbox
                checked={priceFilter === type}
                onCheckedChange={() => setPriceFilter(type)}
              />
              <span className="text-sm capitalize">{type}</span>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Level */}
      <div>
        <h3 className="font-semibold mb-3">Level</h3>
        {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
          <div key={level} className="flex items-center gap-2">
            <Checkbox
              checked={selectedLevels.includes(level)}
              onCheckedChange={() => toggleLevel(level)}
            />
            <span className="text-sm">{level}</span>
          </div>
        ))}
      </div>

      <Separator />

      <Button
        variant="outline"
        className="w-full"
        onClick={() => {
          setSelectedCategories([]);
          setSelectedLevels([]);
          setPriceFilter('all');
        }}
      >
        Clear Filters
      </Button>
    </div>
  );

  /* ===================================== */
  /* Render */
  /* ===================================== */

  return (
    <div className="min-h-screen flex flex-col">
      

      <div className="flex-1">
        <div className=" mx-auto px-6 py-10">

          {/* Header */}
          <div className="mb-10">
            <h1 className="text-3xl font-semibold mb-4">
              Explore Courses
            </h1>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search courses..."
                  className="pl-10"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

            <div className="flex gap-2">
                <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-low">Price: Low</SelectItem>
                  <SelectItem value="price-high">Price: High</SelectItem>
                </SelectContent>
              </Select>
              {/* Mobile Filter */}
            <div className="lg:hidden  bottom-6 right-6 z-50">
              <Sheet>
                <SheetTrigger asChild className='flex items-center justify-center mt-2'>
                   <SlidersHorizontal className="w-5 h-5 mr-2 my-auto" />
                </SheetTrigger>
                <SheetContent>
                  <div className="mt-10">
                    <FilterSidebar />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
            </div>
            </div>
          </div>

          <div className="flex gap-10">

            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-64">
              <div className="sticky top-24 border rounded-xl p-6 bg-card shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <SlidersHorizontal className="w-5 h-5" />
                  <h2 className="font-semibold">Filters</h2>
                </div>
                <FilterSidebar />
              </div>
            </aside>


            

            {/* Course Grid */}
            <div className="flex-1">

              {loading ? (
                <div className="flex justify-center py-20">
                  <Loader2 className="animate-spin w-8 h-8 text-primary" />
                </div>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground mb-4">
                    {courses.length} courses found
                  </p>

                  {courses.length === 0 ? (
                    <div className="text-center py-20 text-muted-foreground">
                      No courses found.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                      {courses.map((course) => (
                        <CourseCard
                          key={course._id}
                          {...course}
                        />
                      ))}
                    </div>
                  )}
                </>
              )}

            </div>
          </div>
        </div>
      </div>

      
    </div>
  );
}
