module increase_add::increase {
    use std::signer;
    
    #[test_only]
    use aptos_framework::account;

    struct Count has key {
        count: u64
    }

  // for intializing counter variable for the specific smart contract

    public entry fun createcounter(account: &signer) {
        let addr = signer::address_of(account);
    
        if (!exists<Count>(addr)) {
            move_to(account, Count { count: 0 });
        }
    }


   const E_NOT_INITIALIZED: u64 = 1;

// function for raising the counter value 
    public entry fun raise_c(account: &signer) acquires Count {
        let signer_add = signer::address_of(account);
        assert!(exists<Count>(signer_add), E_NOT_INITIALIZED);
        let number_p = borrow_global_mut<Count>(signer_add);
        let counter = number_p.count + 1;
            number_p.count = counter;
    }

 // function for decrementing the counter value   

    public entry fun decrement_c(account: &signer) acquires Count {
        let signer_add = signer::address_of(account);
        assert!(exists<Count>(signer_add), E_NOT_INITIALIZED);
        let number_p = borrow_global_mut<Count>(signer_add);
         let counter = number_p.count - 1;
            number_p.count = counter;

    }

    #[test(admin = @0x123)]
    public entry fun test_flow(admin: signer) acquires Count {
        account::create_account_for_test(signer::address_of(&admin));
        createcounter(&admin);
        raise_c(&admin);
        decrement_c(&admin);
    }
    
}