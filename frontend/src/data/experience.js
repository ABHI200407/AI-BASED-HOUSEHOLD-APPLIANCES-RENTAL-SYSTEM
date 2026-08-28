const localMap = {
  'apartment.jpg': '/downloaded_images/living_room/full_room/full_room_001_pid6980724.jpg',
  'bedroom.jpg': '/downloaded_images/bedroom/full_room/full_room_001_pid6903157.jpg',
  'dining.jpg': '/downloaded_images/dining_room/dining_tables/dining_tables_001_pid7180275.jpg',
  'study.jpg': '/downloaded_images/study_room/bookshelves/bookshelves_001_pid30947329.jpg',
  'sofa.jpg': '/downloaded_images/living_room/sofas/sofas_001_pid7587782.jpg',
  'bed.jpg': '/downloaded_images/bedroom/beds/beds_001_pid7445084.jpg',
  'refrigerator.jpg': '/downloaded_images/appliances/refrigerator/refrigerator_001_pid9646742.jpg',
  'washer.jpg': '/downloaded_images/appliances/washing_machine/washing_machine_001_pid4440652.jpg',
  'ac.jpg': '/downloaded_images/appliances/ac/ac_001_pid16848596.jpg',
  'tv.jpg': '/downloaded_images/appliances/tv/tv_001_pid5202925.jpg',
  'combo-starter.jpg': '/downloaded_images/combos/1bhk/1bhk_001_pid3990542.jpg',
  'combo-1bhk.jpg': '/downloaded_images/combos/2bhk/2bhk_001_pid6585598.jpg',
  'hero-work.jpg': '/downloaded_images/office_furniture/desks/desks_001_pid8369211.jpg',
  'lifestyle-01.jpg': '/downloaded_images/lifestyle/apartments/apartments_001_pid4792297.jpg',
  'living-room.jpg': '/downloaded_images/living_room/full_room/full_room_001_pid6980724.jpg',
  'hero-lounge.jpg': '/downloaded_images/living_room/full_room/full_room_001_pid6980724.jpg',
};

const image = (name) => localMap[name] || `/downloaded_images/living_room/full_room/full_room_001_pid6980724.jpg`;

export const cityOptions = ['Bengaluru', 'Mumbai', 'Delhi NCR', 'Hyderabad', 'Pune', 'Chennai'];

export const roomCollections = [
  {
    id: 'living',
    title: 'Living, but lighter',
    eyebrow: 'Living room',
    copy: 'Sofas, storage, and the pieces that turn an address into a place.',
    image: image('apartment.jpg'),
    accent: 'lime',
  },
  {
    id: 'bedroom',
    title: 'A softer landing',
    eyebrow: 'Bedroom',
    copy: 'Beds, mattresses, and storage that make the first night easy.',
    image: image('bedroom.jpg'),
    accent: 'coral',
  },
  {
    id: 'dining',
    title: 'Made for company',
    eyebrow: 'Dining',
    copy: 'A considered dining setup, without the long-term commitment.',
    image: image('dining.jpg'),
    accent: 'sand',
  },
  {
    id: 'study',
    title: 'Work has a place',
    eyebrow: 'Study',
    copy: 'Focused pieces for a serious workday in a small footprint.',
    image: image('study.jpg'),
    accent: 'blue',
  },
];

export const featuredProducts = [
  {
    id: 'horizon-sofa',
    category: 'Furniture',
    name: 'Horizon three-seater',
    price: 899,
    tenure: 'from 3 months',
    rating: '4.9',
    badge: 'Most loved',
    image: image('sofa.jpg'),
    tags: ['living', 'furniture'],
  },
  {
    id: 'linen-bed',
    category: 'Furniture',
    name: 'Linen queen bed set',
    price: 1099,
    tenure: 'from 3 months',
    rating: '4.8',
    badge: 'Move-in edit',
    image: image('bed.jpg'),
    tags: ['bedroom', 'furniture'],
  },
  {
    id: 'focus-desk',
    category: 'Furniture',
    name: 'Focus work desk',
    price: 499,
    tenure: 'from 3 months',
    rating: '4.7',
    badge: 'WFH ready',
    image: image('study.jpg'),
    tags: ['study', 'furniture'],
  },
  {
    id: 'cool-refrigerator',
    category: 'Appliances',
    name: 'Cool double-door refrigerator',
    price: 749,
    tenure: 'from 3 months',
    rating: '4.8',
    badge: 'Energy smart',
    image: image('refrigerator.jpg'),
    tags: ['kitchen', 'appliances'],
  },
  {
    id: 'clean-washer',
    category: 'Appliances',
    name: 'Clean front-load washer',
    price: 699,
    tenure: 'from 3 months',
    rating: '4.8',
    badge: 'Service included',
    image: image('washer.jpg'),
    tags: ['utility', 'appliances'],
  },
  {
    id: 'quiet-air',
    category: 'Appliances',
    name: 'Quiet split AC',
    price: 1199,
    tenure: 'from 3 months',
    rating: '4.9',
    badge: 'Summer essential',
    image: image('ac.jpg'),
    tags: ['utility', 'appliances'],
  },
  {
    id: 'cinema-tv',
    category: 'Appliances',
    name: 'Cinema smart TV',
    price: 799,
    tenure: 'from 3 months',
    rating: '4.7',
    badge: 'New arrival',
    image: image('tv.jpg'),
    tags: ['living', 'appliances'],
  },
  {
    id: 'host-dining',
    category: 'Furniture',
    name: 'Host dining set',
    price: 999,
    tenure: 'from 3 months',
    rating: '4.8',
    badge: 'Six seater',
    image: image('dining.jpg'),
    tags: ['dining', 'furniture'],
  },
];

export const rentalPackages = [
  {
    id: 'first-key',
    title: 'The first-key kit',
    price: '₹2,899/mo',
    label: '1 BHK',
    image: image('combo-starter.jpg'),
    items: ['Queen bed + mattress', 'Three-seater sofa', 'Refrigerator', 'Washer'],
    color: 'clay',
  },
  {
    id: 'homebody',
    title: 'The homebody edit',
    price: '₹4,799/mo',
    label: '2 BHK',
    image: image('combo-1bhk.jpg'),
    items: ['Bedroom set', 'Living setup', 'Dining table', 'Kitchen appliances'],
    color: 'ink',
  },
  {
    id: 'work-ready',
    title: 'The work-ready kit',
    price: '₹1,299/mo',
    label: 'Studio',
    image: image('hero-work.jpg'),
    items: ['Desk + chair', 'Storage cabinet', 'Task lighting', 'Fast swap support'],
    color: 'olive',
  },
];

export const inspirations = [
  {
    title: 'The five-day move',
    category: 'Move stories',
    copy: 'A practical guide to creating a liveable home before your first Monday.',
    image: image('lifestyle-01.jpg'),
  },
  {
    title: 'The renter’s edit',
    category: 'Small spaces',
    copy: 'How to make an apartment feel deliberate without filling every corner.',
    image: image('living-room.jpg'),
  },
  {
    title: 'A table for Sunday',
    category: 'At home',
    copy: 'Low-effort hosting pieces that earn their place all week long.',
    image: image('dining.jpg'),
  },
  {
    title: 'The calm work corner',
    category: 'Work from home',
    copy: 'A desk setup that protects focus when home and work share a room.',
    image: image('study.jpg'),
  },
];

export const businessSolutions = [
  { title: 'Co-living', copy: 'Launch repeatable, guest-ready rooms without capital-heavy buying.', metric: '20-200 rooms' },
  { title: 'Workspaces', copy: 'Furniture and appliances for teams changing shape quickly.', metric: '15-day setup' },
  { title: 'Hospitality', copy: 'Design-led furniture packages for stays that need to feel considered.', metric: 'Flexible terms' },
];

export const trustFigures = [
  { value: '48 hrs', label: 'to a liveable home' },
  { value: '4.8/5', label: 'renter satisfaction' },
  { value: '0', label: 'setup coordination calls' },
  { value: '12', label: 'cities in motion' },
];

export const shoppingTypes = {
  furniture: {
    kicker: 'Furniture rentals',
    title: 'Pieces with a point of view.',
    copy: 'Furnish the rooms you use most without turning a move into a warehouse project.',
    image: image('hero-lounge.jpg'),
    filter: 'furniture',
    highlights: ['Free relocation', 'Quality checked', 'Easy swaps'],
  },
  appliances: {
    kicker: 'Appliance rentals',
    title: 'Your home, fully switched on.',
    copy: 'Essential appliances with delivery, installation, and service already in the plan.',
    image: image('refrigerator.jpg'),
    filter: 'appliances',
    highlights: ['Installation included', 'Maintenance covered', 'Flexible tenure'],
  },
};

export function asCartItem(product) {
  return {
    id: product.id,
    name: product.name,
    category: product.category,
    monthly_rent: product.price,
    price_per_day: Math.round(product.price / 30),
    deposit: product.price * 2,
    available: true,
    images: [product.image],
  };
}
