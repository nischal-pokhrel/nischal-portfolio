import java.util.Scanner;

// --- CORE SYSTEM: INHERITANCE & ENCAPSULATION ---
abstract class Vehicle {
    private String brand, id;
    private long price;
    private int topSpeed, weight;

    public Vehicle(String brand, long price, String id, int topSpeed, int weight) {
        this.brand = brand;
        this.price = price;
        this.id = id;
        this.topSpeed = topSpeed;
        this.weight = weight;
    }

    public String getBrand() { return brand; }
    public String getID() { return id; }
    public long getPrice() { return price; }
    public int getTopSpeed() { return topSpeed; }
    public int getWeight() { return weight; }

    public abstract int calculateTax(); // Polymorphism for Nepal 2026 Tax Rules

    public void showDetailedReport() {
        System.out.println("\n" + "╔" + "═".repeat(48) + "╗");
        System.out.println("║        🔍 OFFICIAL VEHICLE DATASHEET         ║");
        System.out.println("╠" + "═".repeat(48) + "╣");
        System.out.printf("║ %-18s: %-26s ║\n", "Model Name", brand);
        System.out.printf("║ %-18s: %-26s ║\n", "Registry ID", id);
        System.out.printf("║ %-18s: NPR %,d %-10s ║\n", "Market Price", price, "");
        System.out.printf("║ %-18s: %-26s ║\n", "Top Speed", topSpeed + " km/h");
        System.out.printf("║ %-18s: %-26s ║\n", "Kerb Weight", weight + " kg");
    }
}

// --- ELECTRIC CATEGORY ---
class ElectricVehicle extends Vehicle {
    private int battery; // Watts for bikes, kWh for cars
    private int range;

    public ElectricVehicle(String b, long p, String id, int s, int w, int bat, int r) {
        super(b, p, id, s, w);
        this.battery = bat;
        this.range = r;
    }

    @Override
    public int calculateTax() {
        if (getID().startsWith("B")) { // E-Bikes
            if (battery <= 1000) return 2000;
            if (battery <= 1500) return 2500;
            return 3000;
        } else { // E-Cars
            if (battery <= 50) return 10000;
            if (battery <= 125) return 15000;
            return 20000;
        }
    }

    @Override
    public void showDetailedReport() {
        super.showDetailedReport();
        String unit = getID().startsWith("B") ? "Watts" : "kWh";
        System.out.printf("║ %-18s: %-26s ║\n", "Battery", battery + " " + unit);
        System.out.printf("║ %-18s: %-26s ║\n", "Real Range", range + " km");
        System.out.printf("║ %-18s: NPR %,d %-10s ║\n", "Annual Road Tax", calculateTax(), "");
        System.out.println("╚" + "═".repeat(48) + "╝");
    }
}

// --- PETROL CATEGORY ---
class PetrolVehicle extends Vehicle {
    private int cc;

    public PetrolVehicle(String b, long p, String id, int s, int w, int cc) {
        super(b, p, id, s, w);
        this.cc = cc;
    }

    @Override
    public int calculateTax() {
        if (getID().startsWith("B")) { // Petrol Bikes
            if (cc <= 125) return 3000;
            if (cc <= 160) return 5000;
            if (cc <= 250) return 6500;
            if (cc <= 400) return 12000;
            if (cc <= 650) return 25000;
            return 35000;
        } else { // Petrol Cars
            if (cc <= 1000) return 22000;
            if (cc <= 1500) return 25000;
            if (cc <= 2500) return 37000;
            return 50000;
        }
    }

    @Override
    public void showDetailedReport() {
        super.showDetailedReport();
        System.out.printf("║ %-18s: %-26s ║\n", "Engine", cc + " cc");
        System.out.printf("║ %-18s: NPR %,d %-10s ║\n", "Annual Road Tax", calculateTax(), "");
        System.out.println("╚" + "═".repeat(48) + "╝");
    }
}

public class VehicleSystem {
    static Vehicle[] garage = new Vehicle[100];
    static int count = 0;

    public static void seedData() {
        // Real 2026 Market Data for Nepal
        garage[count++] = new PetrolVehicle("Royal Enfield GT650", 1249000, "B-P01", 170, 202, 648);
        garage[count++] = new PetrolVehicle("Kawasaki Ninja 500", 1250000, "B-P02", 190, 171, 451);
        garage[count++] = new PetrolVehicle("BMW G310 GS", 1450000, "B-P03", 143, 175, 313);
        garage[count++] = new ElectricVehicle("Ather 450X Gen4", 405000, "B-E01", 90, 108, 3700, 150);
        garage[count++] = new ElectricVehicle("Hyundai Ioniq 5", 9296000, "C-E01", 185, 1910, 58, 375);
        garage[count++] = new ElectricVehicle("BYD Sealion 7", 7499000, "C-E02", 215, 2150, 71, 482);
        garage[count++] = new PetrolVehicle("Toyota Hilux Rocco", 11500000, "C-P01", 180, 2100, 2800);
    }

    public static void main(String[] args) {
        seedData();
        Scanner sc = new Scanner(System.in);

        while (true) {
            System.out.println("\n" + "█".repeat(60));
            System.out.println("   🇳🇵 NISCHAL AUTO HUB: Smart Vehicle Management System 2026 🇳🇵   ");
            System.out.println("█".repeat(60));
            System.out.println(" [1] ADMIN PANEL  [2] CUSTOMER PORTAL  [3] EXIT");
            System.out.print("Choice: ");
            int mainChoice = sc.nextInt();

            if (mainChoice == 3) break;

            if (mainChoice == 1) { // ADMIN
                System.out.print("Enter Key: ");
                if (!sc.next().equals("uts2026")) { System.out.println("Wrong Key!"); continue; }

                System.out.print("Type (1.Bike/2.Car): "); int type = sc.nextInt();
                System.out.print("Fuel (1.EV/2.Petrol): "); int fuel = sc.nextInt();
                sc.nextLine();
                System.out.print("Brand Name: "); String b = sc.nextLine();
                System.out.print("Price (NPR): "); long p = sc.nextLong();
                System.out.print("Top Speed: "); int s = sc.nextInt();
                System.out.print("Weight (kg): "); int w = sc.nextInt();
                String id = (type == 1 ? "B-" : "C-") + (fuel == 1 ? "E" : "P") + String.format("%02d", count+1);

                if (fuel == 1) {
                    System.out.print("Battery (W/kWh): "); int bat = sc.nextInt();
                    System.out.print("Range (km): "); int r = sc.nextInt();
                    garage[count++] = new ElectricVehicle(b, p, id, s, w, bat, r);
                } else {
                    System.out.print("Engine (CC): ");
                    garage[count++] = new PetrolVehicle(b, p, id, s, w, sc.nextInt());
                }
                System.out.println("✓ Added successfully as " + id);

            } else if (mainChoice == 2) { // CUSTOMER
                System.out.println("\n[1] BIKES  [2] CARS");
                int catChoice = sc.nextInt();
                System.out.println("[1] ELECTRIC (EV)  [2] PETROL (ICE)");
                int engChoice = sc.nextInt();

                String filter = (catChoice == 1 ? "B-" : "C-") + (engChoice == 1 ? "E" : "P");

                System.out.println("\n" + "─".repeat(50));
                System.out.printf("%-10s | %-22s | %-15s\n", "ID", "MODEL", "PRICE (NPR)");
                System.out.println("─".repeat(50));

                for (int i = 0; i < count; i++) {
                    if (garage[i].getID().startsWith(filter)) {
                        System.out.printf("%-10s | %-22s | Rs. %,d\n", garage[i].getID(), garage[i].getBrand(), garage[i].getPrice());
                    }
                }

                System.out.print("\nType ID for full tech-specs (or '0' to exit): ");
                String search = sc.next();
                if (!search.equals("0")) {
                    for (int i = 0; i < count; i++) {
                        if (garage[i].getID().equalsIgnoreCase(search)) garage[i].showDetailedReport();
                    }
                }
            }
        }
        System.out.println("Thank you for using Nischal Auto Hub!");
    }
}