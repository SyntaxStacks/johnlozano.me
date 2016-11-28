+++
date = "2016-11-12T11:08:56-06:00"
title = "Testing Spree Commerce with RSpec"

author = "John Lozano"
draft = false
slug = "testing-spree-commerce-with-rspec"
tags = ["testing", "rails", "ruby"]
image = "/assets/images/spree.png"
comments = true     # set false to hide Disqus comments
share = true        # set false to share buttons
menu = "main"           # set "main" to add this content to the main menu
+++

Spree commerce is a rails plugin that allows users to stand up their own ecommerce platform.
I am currently working on a project that will integrate a drop shipping API with spreee commerce
and insist on testing my work to prevent regressions moving forward. The current issue that
I am solving for is to send an order to the drop shipper via an API call upon completion of an order.
The API call has been encapsulated in a method named `submit_order_to_printful` on the `Spree::Order` model and a test is needed to validate
that the method is being called when we are expecting it to be.

## Testing with RSpec

###### spec/models/order_decorator_spec.rb
```
require 'rails_helper'

# Turn off the job queue
Delayed::Worker.delay_jobs = false

describe Spree::Order, type: :model do
  let(:order) { FactoryGirl.create(:order_with_line_items)}
  before do
    allow(order).to receive(:require_email)
    allow(Spree::Order.printful_api).to receive(:post)
  end

  context "when current state is confirm" do
    before do
      order.state = "confirm"

      # Mocking Spree::Order checkout_flow requirements
      allow(order).to receive_messages payment_required?: true
      allow(order).to receive_messages process_payments!: true
      allow(order).to receive_messages confirmation_delivered?: true
    end

    context "when payment processing succeeds" do
      before do
        order.payments << FactoryGirl.create(:payment, state: 'checkout', order: order)
      end

      it "should submit order to printful" do
        expect(Spree::Order).to receive(:submit_order_to_printful)
        order.next!
        expect(order.state).to eq('complete')
      end
    end
  end
end

```

We start by disabling [DelayedJob](https://github.com/tobi/delayed_job) for testing purposes.

```
require 'rails_helper'

# Turn off job queue
Delayed::Worker.delay_jobs = false
```

Then the order state is set to `confirm`. The [Checkout Flow](https://github.com/spree/spree/blob/master/core/app/models/spree/order.rb#L46-L53)
for the Order model in spree requires a few conditions at various points during the checkout.
We can force the flow of the checkout by mocking the conditions require for completion.

```
order.state = "confirm"

# Mocking Spree::Order checkout_flow requirements
allow(order).to receive_messages payment_required?: true
allow(order).to receive_messages process_payments!: true
allow(order).to receive_messages confirmation_delivered?: true
```

That will allow us to test the logic of the checkout process in isolation.

```
context "when payment processing succeeds" do
  before do
    order.payments << FactoryGirl.create(:payment, state: 'checkout', order: order)
  end

  it "should submit order to printful" do
    expect(Spree::Order).to receive(:submit_order_to_printful)
    order.next!
    expect(order.state).to eq('complete')
  end
end
```

We add a fake payment to the order and then start our assertions and actions. `order.next!` steps the
`complete` state and we can expect that the `submit_order_to_printful` method is called.

## The Code

The code to implement the hook is simple

###### app/models/spree/order_decorator.rb
```
Spree::Order.class_eval do
  include PrintfulConcern

  state_machine.after_transition :to => :complete do |order|
    Spree::Order.submit_order_to_printful(order)
  end
end
```

The `PrintfulConcern` contains the integration to the printful api and adds `submit_order_to_printful`
method to the Spree:Order class. With that we add logic to the `complete` state's after_transition hook
and pass the order information to the method.

## Conclusion

Now that we have the functionality implemented and tested, we can place orders in spree and see orders populated
in Printfuls control panel. The work we have today will work tomorrow, and when it doesn't, we will know.
